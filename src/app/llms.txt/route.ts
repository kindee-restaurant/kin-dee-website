import { getSiteDataPublic } from "@/lib/siteData";
import {
    ADDRESS_LINE,
    CUISINES,
    DEFAULT_DESCRIPTION,
    DELIVEROO_URL,
    GOOGLE_PROFILE_URL,
    MAPS_URL,
    PAGES,
    SITE_URL,
    VOUCHER_URL,
    absoluteUrl,
    buildFaqs,
    contactEmail,
    contactPhone,
    groupWines,
    socialLinks,
} from "@/lib/seo";

// /llms.txt — a plain-Markdown summary of the restaurant for AI assistants (ChatGPT, Claude, Gemini, Perplexity…),
// generated from the same live database as the website so it never goes stale. See https://llmstxt.org
export const revalidate = 3600;

const oneLine = (s?: string | null) => (s ?? "").replace(/\s+/g, " ").trim();

export async function GET() {
    const data = await getSiteDataPublic();
    const { settings } = data;
    const socials = socialLinks(settings);
    const menus = data.menus.filter((m) => m.is_visible !== false);
    const wines = groupWines(data);
    const faqs = buildFaqs(data);

    const lines: string[] = [
        "# Kin Dee",
        "",
        `> ${DEFAULT_DESCRIPTION}`,
        "",
        "Kin Dee (“eat well” in Thai) is an independent South East Asian restaurant in Dublin 4, Ireland, serving Thai classics and modern Asian fusion dishes made with Irish produce.",
        "",
        "## Key facts",
        `- Name: Kin Dee (also written KinDee; Kin Dee Restaurant Dublin)`,
        `- Cuisine: ${CUISINES.join(", ")}`,
        `- Address: ${ADDRESS_LINE}`,
        `- Area: Leeson Street Upper, between Ranelagh and Ballsbridge, Dublin 4`,
        `- Phone: ${contactPhone(settings)}`,
        `- Email: ${contactEmail(settings)}`,
        `- Website: ${SITE_URL}`,
        `- Book a table: ${SITE_URL}/contact#reservations`,
        `- Takeaway: call ${contactPhone(settings)}; delivery via Deliveroo: ${DELIVEROO_URL}`,
        `- Gift vouchers: ${VOUCHER_URL}`,
        `- Map: ${MAPS_URL}`,
        `- Google reviews: ${GOOGLE_PROFILE_URL}`,
        `- Instagram: ${socials.instagram}`,
        `- Facebook: ${socials.facebook}`,
        "- Dietary: every dish labelled with the 14 EU allergens; vegan and vegetarian options available",
        "",
    ];

    if (data.hours.length) {
        lines.push("## Opening hours", ...data.hours.map((h) => `- ${h.day_range}: ${h.hours}`), "");
    }

    const specials = data.specialMenus.filter((m) => m.is_active);
    if (specials.length) {
        lines.push("## Seasonal menu (available now)");
        for (const m of specials) {
            const link = m.pdf_url || (m.image_url ? absoluteUrl(m.image_url) : null);
            lines.push(
                `- [${m.title}](${link || `${SITE_URL}/menu`})${m.price_text ? ` — ${m.price_text}` : ""}${m.description ? `: ${oneLine(m.description)}` : ""}`
            );
        }
        lines.push("");
    }

    if (menus.length) {
        lines.push("## Menus", `All menus: ${SITE_URL}/menu`, "");
        for (const m of menus) {
            lines.push(`- [${m.title}](${m.pdf_url || `${SITE_URL}/menu`})${m.description ? `: ${oneLine(m.description)}` : ""}`);
        }
        lines.push("");
    }

    if (wines.length) {
        lines.push("## Wine list", `Full list: ${SITE_URL}/wine-list`, "");
        for (const g of wines) {
            lines.push(`### ${g.label}`);
            for (const w of g.items) {
                const prices = [w.price_glass && `glass ${w.price_glass.replace(/€\s+/, "€")}`, `${w.size || "bottle"} ${w.price_bottle.replace(/€\s+/, "€")}`]
                    .filter(Boolean)
                    .join(", ");
                lines.push(`- ${w.name}${w.origin ? ` (${w.origin})` : ""}: ${prices}`);
            }
            lines.push("");
        }
    }

    if (settings?.about_text) {
        lines.push("## About", oneLine(settings.about_text), "");
    }

    lines.push("## FAQ", ...faqs.flatMap((f) => [`### ${f.question}`, f.answer, ""]));

    lines.push("## Pages", ...PAGES.map((p) => `- [${p.name}](${SITE_URL}${p.path === "/" ? "" : p.path}): ${p.description}`), "");

    return new Response(lines.join("\n"), {
        headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
    });
}
