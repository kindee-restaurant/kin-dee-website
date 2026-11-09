import { unstable_cache } from "next/cache";
import { getSiteDataRaw } from "@/lib/siteData";
import { parseMediaFile, type MediaKind } from "@/lib/media";

// Serves images under readable kindee.ie URLs (see src/lib/media.ts) by streaming them from Supabase storage.

async function buildTable() {
        const d = await getSiteDataRaw();
        const key = (id?: string) => (id || "x").replace(/-/g, "").slice(0, 8).toLowerCase();
        const table: Record<string, string> = {};
        const add = (kind: MediaKind, id: string | undefined, url: string | null | undefined) => {
            if (url) table[`${kind}:${key(id)}`] = url;
        };
        d.galleryImages.forEach((g) => add("gallery", g.id, g.image_url));
        d.menus.forEach((m) => add("menu", m.id, m.image_url));
        d.specialMenus.forEach((m) => add("special", m.id, m.image_url));
        add("hero", "hero", d.hero?.image_url);
        add("about", "about", d.settings?.about_image);
        return table;
}

const lookupTable = unstable_cache(buildTable, ["media-lookup"], { revalidate: 300 });

const KINDS = new Set(["gallery", "menu", "special", "hero", "about"]);

export async function GET(_req: Request, { params }: { params: { kind: string; file: string } }) {
    const parsed = parseMediaFile(params.file);
    if (!KINDS.has(params.kind) || !parsed) return new Response("Not found", { status: 404 });

    const id = `${params.kind}:${parsed.key}`;
    // Newly uploaded images may not be in the cached table yet.
    const source = (await lookupTable())[id] ?? (await buildTable())[id];
    if (!source) return new Response("Not found", { status: 404 });

    const upstream = await fetch(source, { next: { revalidate: 86400 } });
    if (!upstream.ok || !upstream.body) return new Response("Not found", { status: 404 });

    return new Response(upstream.body, {
        headers: {
            "Content-Type": upstream.headers.get("content-type") || "image/jpeg",
            "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
            "X-Robots-Tag": "all",
        },
    });
}
