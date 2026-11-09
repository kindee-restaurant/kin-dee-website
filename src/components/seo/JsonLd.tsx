/** Renders one or more schema.org objects as JSON-LD. Server component; `<` is escaped so data can't break out of the tag. */
export function JsonLd({ data }: { data: object | (object | null)[] | null }) {
    const items = (Array.isArray(data) ? data : [data]).filter(Boolean);
    if (!items.length) return null;
    const json = JSON.stringify(items.length === 1 ? items[0] : items).replace(/</g, "\u003c");
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
