import { PAGES, SITE_URL, absoluteUrl, seoImage } from "@/lib/seo";
import { getSiteDataPublic } from "@/lib/siteData";

// Hand-written sitemap so it can include Google image-sitemap entries (Next 14's sitemap.ts drops them).
// Every image is listed under its readable kindee.ie/media/... URL.
export const revalidate = 3600;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
    const data = await getSiteDataPublic();
    const lastmod = new Date().toISOString();

    const priority: Record<string, string> = { "/": "1.0", "/menu": "0.9", "/contact": "0.9", "/wine-list": "0.7", "/gallery": "0.7" };
    const images: Record<string, (string | undefined | null)[]> = {
        "/": [seoImage("hero", "south east asian food", "hero", data.hero?.image_url), "/opengraph-image.jpg"],
        "/menu": [
            ...data.specialMenus.map((m) => seoImage("special", m.title, m.id, m.image_url)),
            ...data.menus.map((m) => seoImage("menu", m.title, m.id, m.image_url)),
        ],
        "/about": [seoImage("about", "restaurant dining room", "about", data.settings?.about_image)],
        "/gallery": data.galleryImages.map((g) => seoImage("gallery", g.alt_text, g.id, g.image_url)),
    };

    const urls = PAGES.map((p) => {
        const loc = p.path === "/" ? SITE_URL : `${SITE_URL}${p.path}`;
        const imgs = (images[p.path] || [])
            .filter((u): u is string => !!u)
            .map((u) => `    <image:image><image:loc>${esc(absoluteUrl(u))}</image:loc></image:image>`)
            .join("\n");
        return [
            "  <url>",
            `    <loc>${esc(loc)}</loc>`,
            `    <lastmod>${lastmod}</lastmod>`,
            `    <changefreq>${p.path === "/" || p.path === "/menu" ? "weekly" : "monthly"}</changefreq>`,
            `    <priority>${priority[p.path] ?? "0.6"}</priority>`,
            imgs,
            "  </url>",
        ]
            .filter(Boolean)
            .join("\n");
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>
`;
    return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
