import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { parseMediaFile } from "@/lib/media";

// Serves images under readable kindee.ie URLs (see src/lib/media.ts) for search engines, sitemaps and AI crawlers.
// The website itself renders images straight from Supabase via next/image; this route is not on the page path.

const key = (id?: string | null) => (id || "x").replace(/-/g, "").slice(0, 8).toLowerCase();

async function buildTable(): Promise<Record<string, string>> {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        auth: { persistSession: false },
    });
    // Only the columns needed to resolve an image — not the whole site.
    const [gallery, menus, specials, hero, settings] = await Promise.all([
        supabase.from("gallery_images").select("id,image_url"),
        supabase.from("menus").select("id,image_url"),
        supabase.from("special_menus").select("id,image_url"),
        supabase.from("hero_section").select("image_url").limit(1),
        supabase.from("site_settings").select("about_image").limit(1),
    ]);
    const table: Record<string, string> = {};
    const add = (kind: string, id: string | null | undefined, url: string | null | undefined) => {
        if (url) table[`${kind}:${key(id)}`] = url;
    };
    gallery.data?.forEach((r) => add("gallery", r.id, r.image_url));
    menus.data?.forEach((r) => add("menu", r.id, r.image_url));
    specials.data?.forEach((r) => add("special", r.id, r.image_url));
    add("hero", "hero", hero.data?.[0]?.image_url);
    add("about", "about", settings.data?.[0]?.about_image);
    if (gallery.error || menus.error) throw new Error("image lookup failed"); // don't cache a partial table
    return table;
}

const lookupTable = unstable_cache(buildTable, ["media-lookup-v2"], { revalidate: 600 });

const KINDS = new Set(["gallery", "menu", "special", "hero", "about"]);

export async function GET(_req: Request, { params }: { params: { kind: string; file: string } }) {
    const parsed = parseMediaFile(params.file);
    if (!KINDS.has(params.kind) || !parsed) return new Response("Not found", { status: 404 });

    const id = `${params.kind}:${parsed.key}`;
    let source: string | undefined;
    try {
        // Newly uploaded images may not be in the cached table yet.
        source = (await lookupTable())[id] ?? (await buildTable())[id];
    } catch {
        return new Response("Temporarily unavailable", { status: 503, headers: { "Retry-After": "30" } });
    }
    if (!source) return new Response("Not found", { status: 404 });

    const upstream = await fetch(source, { cache: "no-store" });
    if (!upstream.ok || !upstream.body) return new Response("Temporarily unavailable", { status: 502 });

    return new Response(upstream.body, {
        headers: {
            "Content-Type": upstream.headers.get("content-type") || "image/jpeg",
            // Browsers 1 day; Vercel's CDN 7 days, then refreshed in the background.
            "Cache-Control": "public, max-age=86400",
            "CDN-Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400",
        },
    });
}
