/**
 * SEO-friendly image URLs on kindee.ie.
 *
 * Images live in Supabase storage under URLs like ".../images/gallery/1770672993340.jpeg". Search engines rank
 * images partly by their URL/filename and the domain serving them, so the site links to readable URLs instead:
 *
 *   /media/gallery/beef-chilli-kin-dee-dublin-88e186cc.jpeg
 *   /media/menu/lunch-menu-kin-dee-dublin-3698a81b.jpeg
 *
 * The trailing 8 characters are the start of the row id, used to look the image up; the words are for people and
 * search engines. src/app/media/[kind]/[file]/route.ts serves the actual file.
 */

export type MediaKind = "gallery" | "menu" | "special" | "hero" | "about";

export const slugify = (s: string) =>
    s
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);

const extOf = (url: string) => {
    const m = url.split("?")[0].match(/\.(jpe?g|png|webp|gif|avif)$/i);
    return m ? m[1].toLowerCase() : "jpg";
};

/** Builds the public /media URL for an image stored in Supabase. Returns the original URL if it isn't one of ours. */
export function mediaUrl(kind: MediaKind, label: string | null | undefined, id: string | null | undefined, sourceUrl?: string | null) {
    if (!sourceUrl) return undefined;
    if (!sourceUrl.includes("supabase.co/storage/")) return sourceUrl;
    const words = slugify(`${label || "photo"} kin dee dublin`);
    const key = (id || "x").replace(/-/g, "").slice(0, 8);
    return `/media/${kind}/${words}-${key}.${extOf(sourceUrl)}`;
}

/** Parses "/media/<kind>/<words>-<key>.<ext>" back into its lookup key. */
export function parseMediaFile(file: string) {
    const m = file.match(/-([a-z0-9]{1,8})\.(jpe?g|png|webp|gif|avif)$/i);
    return m ? { key: m[1].toLowerCase() } : null;
}
