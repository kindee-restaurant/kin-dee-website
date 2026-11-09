import type { Metadata } from "next";
import type { BusinessHours, SiteData, WineItem } from "@/lib/siteData";
import { getSpecialMenuTypeConfig } from "@/lib/specialMenus";
import { mediaUrl, type MediaKind } from "@/lib/media";

/* ------------------------------------------------------------------ */
/* Fixed facts about the restaurant (things that are not in the DB)    */
/* ------------------------------------------------------------------ */

export const SITE_URL = "https://kindee.ie";
export const SITE_NAME = "Kin Dee";

export const ADDRESS = {
    streetAddress: "133 Leeson Street Upper",
    addressLocality: "Dublin 4",
    addressRegion: "County Dublin",
    postalCode: "D04 HX48",
    addressCountry: "IE",
};
export const ADDRESS_LINE = "133 Leeson Street Upper, Dublin 4, D04 HX48, Ireland";
// Matches the pin used on the Contact map.
export const GEO = { latitude: 53.3304488, longitude: -6.2519312 };
export const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Kin+Dee+133+Leeson+Street+Upper+Dublin+4";
export const DEFAULT_PHONE = "+353 1 963 6162";
export const DEFAULT_EMAIL = "info@kindee.ie";
export const DELIVEROO_URL = "https://deliveroo.ie/menu/Dublin/ballsbridge-d4/kin-dee-indochine";
export const VOUCHER_URL = "https://kindee.giftsmart.ie/";
/** Google Business Profile (Knowledge Graph id /g/11n429hmpb) — links the site to the Google listing and its reviews. */
export const GOOGLE_PROFILE_URL = "https://www.google.com/search?kgmid=/g/11n429hmpb";
export const GOOGLE_REVIEWS_URL = "https://share.google/lwld87QLPGa81MCAG";
const DEFAULT_SOCIALS = {
    facebook: "https://www.facebook.com/share/1CCop44kYC/",
    instagram: "https://www.instagram.com/kindeedublin",
};

export const CUISINES = ["South East Asian", "Thai", "Asian Fusion", "Vietnamese", "Malaysian"];

export const DEFAULT_DESCRIPTION =
    "Kin Dee is a South East Asian restaurant on Leeson Street Upper, Dublin 4. Thai classics and modern Asian fusion made with Irish produce, cocktails and a curated wine list. Book a table, order takeaway or buy a gift voucher.";

/** Short version for <meta name="description"> (Google shows ~155 characters). */
export const META_DESCRIPTION =
    "South East Asian restaurant on Leeson Street Upper, Dublin 4. Thai classics and Asian fusion with Irish produce, cocktails and wine. Book online.";

const SHARE_IMAGE = { url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "Kin Dee – South East Asian restaurant, Leeson Street, Dublin 4" };

/** Public pages, used for navigation, the sitemap and llms.txt. */
export const PAGES = [
    { path: "/", name: "Home", description: "Kin Dee, South East Asian restaurant on Leeson Street, Dublin 4" },
    { path: "/menu", name: "Menus", description: "Lunch, dinner, early-evening and takeaway menus with prices" },
    { path: "/wine-list", name: "Wine List", description: "Wines by the glass and bottle" },
    { path: "/about", name: "About", description: "The story behind Kin Dee" },
    { path: "/gallery", name: "Gallery", description: "Photos of our dishes and dining room" },
    { path: "/catering", name: "Catering", description: "Catering and private events in Dublin" },
    { path: "/contact", name: "Contact & Reservations", description: "Address, opening hours, phone, booking and FAQ" },
] as const;

export const absoluteUrl = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

/**
 * Readable, absolute kindee.ie/media/... URL for a stored image — for search engines and AI (schema, sitemap,
 * llms.txt). Pages themselves render straight from Supabase through next/image, which is faster and more reliable.
 */
export function seoImage(kind: MediaKind, label: string | null | undefined, id: string | null | undefined, url: string | null | undefined) {
    const clean = label?.replace(/\s*\(\d+\)$/, "");
    const m = mediaUrl(kind, clean, id, url);
    return m ? absoluteUrl(m) : undefined;
}

/* ------------------------------------------------------------------ */
/* Helpers that turn database rows into clean, factual SEO data        */
/* ------------------------------------------------------------------ */

/** Ignores placeholder social links (e.g. a bare "https://facebook.com") saved in settings. */
export function socialLinks(settings: SiteData["settings"]) {
    const valid = (url: string | null | undefined) => {
        if (!url) return null;
        try {
            const u = new URL(url);
            return u.pathname.replace(/\/+$/, "").length > 0 ? url : null;
        } catch {
            return null;
        }
    };
    return {
        facebook: valid(settings?.social_facebook) ?? DEFAULT_SOCIALS.facebook,
        instagram: valid(settings?.social_instagram) ?? DEFAULT_SOCIALS.instagram,
    };
}

export const contactPhone = (s: SiteData["settings"]) => s?.contact_phone || DEFAULT_PHONE;
export const contactEmail = (s: SiteData["settings"]) => s?.contact_email || DEFAULT_EMAIL;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function parseDay(token: string): number {
    const t = token.trim().slice(0, 3).toLowerCase();
    return DAYS.findIndex((d) => d.slice(0, 3).toLowerCase() === t);
}

function parseTime(token: string): string | null {
    const m = token.trim().toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
    if (!m) return null;
    let h = parseInt(m[1], 10);
    const min = m[2] ?? "00";
    if (m[3] === "pm" && h < 12) h += 12;
    if (m[3] === "am" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${min}`;
}

export interface ParsedHours {
    days: string[];
    opens: string;
    closes: string;
}

/** "Mon - Thu" + "5pm - 10pm" → { days: [Monday..Thursday], opens: "17:00", closes: "22:00" }. Skips rows it can't read. */
export function parseHours(rows: BusinessHours[]): ParsedHours[] {
    const out: ParsedHours[] = [];
    for (const row of rows) {
        const [fromDay, toDay] = row.day_range.split(/\s*[-–]\s*/);
        const a = parseDay(fromDay);
        const b = toDay ? parseDay(toDay) : a;
        const [o, c] = row.hours.split(/\s*[-–]\s*/);
        const opens = o ? parseTime(o) : null;
        const closes = c ? parseTime(c) : null;
        if (a < 0 || b < 0 || !opens || !closes) continue;
        const days: string[] = [];
        for (let i = a; ; i = (i + 1) % 7) {
            days.push(DAYS[i]);
            if (i === b) break;
        }
        out.push({ days, opens, closes });
    }
    return out;
}

/** Plain-English opening hours, e.g. "Mon - Thu: 5pm - 10pm; Sunday: 1pm - 9pm. Closed Tuesday." */
export function hoursSentence(rows: BusinessHours[]): string {
    if (!rows.length) return "";
    const isClosed = (r: BusinessHours) => /closed/i.test(r.hours);
    const main = rows.filter((r) => !isClosed(r)).map((r) => `${r.day_range}: ${r.hours}`).join("; ");
    const closed = rows.filter(isClosed).map((r) => r.day_range);
    return closed.length ? `${main}. Closed ${closed.join(", ")}.` : `${main}.`;
}

const priceNumber = (p?: string | null) => {
    const n = p?.replace(/[^0-9.]/g, "");
    return n && !isNaN(Number(n)) && Number(n) > 0 ? n : undefined;
};

export function groupWines(data: Pick<SiteData, "wineCategories" | "wineItems">) {
    return data.wineCategories
        .map((c) => ({ ...c, items: data.wineItems.filter((w) => w.category_id === c.id) }))
        .filter((c) => c.items.length > 0);
}

/* ------------------------------------------------------------------ */
/* JSON-LD (schema.org) builders                                      */
/* ------------------------------------------------------------------ */

export const RESTAURANT_ID = `${SITE_URL}/#restaurant`;

export function restaurantJsonLd(data: SiteData) {
    const { settings, hero, hours, menus, specialMenus } = data;
    const socials = socialLinks(settings);
    const images = [
        seoImage("hero", "south east asian food", "hero", hero?.image_url),
        seoImage("about", "restaurant dining room", "about", settings?.about_image),
        absoluteUrl("/opengraph-image.jpg"),
    ].filter((u): u is string => !!u);

    const menuEntries = [
        ...specialMenus
            .filter((m) => m.is_active)
            .map((m) => ({
                "@type": "Menu",
                name: m.title,
                description: m.description || undefined,
                url: `${SITE_URL}/menu#special-menu`,
                ...(m.image_url ? { image: seoImage("special", m.title, m.id, m.image_url) } : {}),
                ...(m.price_text ? { offers: { "@type": "Offer", description: m.price_text, priceCurrency: "EUR" } } : {}),
            })),
        ...menus
            .filter((m) => m.is_visible !== false)
            .map((m) => ({
                "@type": "Menu",
                name: m.title,
                description: m.description || undefined,
                url: m.pdf_url || `${SITE_URL}/menu`,
                ...(m.image_url ? { image: seoImage("menu", m.title, m.id, m.image_url) } : {}),
            })),
    ];

    return {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "@id": RESTAURANT_ID,
        name: SITE_NAME,
        alternateName: ["Kin Dee Dublin", "Kin Dee Restaurant", "KinDee"],
        description: DEFAULT_DESCRIPTION,
        slogan: "Kin Dee means “eat well” in Thai",
        url: SITE_URL,
        logo: `${SITE_URL}/icon3.png`,
        image: images,
        telephone: contactPhone(settings),
        email: contactEmail(settings),
        address: { "@type": "PostalAddress", ...ADDRESS },
        geo: { "@type": "GeoCoordinates", ...GEO },
        hasMap: MAPS_URL,
        areaServed: [{ "@type": "City", name: "Dublin" }, { "@type": "Place", name: "Ballsbridge" }, { "@type": "Place", name: "Ranelagh" }],
        servesCuisine: CUISINES,
        priceRange: "€€",
        currenciesAccepted: "EUR",
        paymentAccepted: "Cash, Credit Card, Debit Card",
        acceptsReservations: true,
        menu: `${SITE_URL}/menu`,
        hasMenu: menuEntries.length ? menuEntries : undefined,
        openingHoursSpecification: parseHours(hours).map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
            opens: h.opens,
            closes: h.closes,
        })),
        sameAs: [socials.facebook, socials.instagram, GOOGLE_PROFILE_URL],
        amenityFeature: [
            { "@type": "LocationFeatureSpecification", name: "Vegetarian options", value: true },
            { "@type": "LocationFeatureSpecification", name: "Vegan options", value: true },
            { "@type": "LocationFeatureSpecification", name: "Takeaway", value: true },
            { "@type": "LocationFeatureSpecification", name: "Delivery (Deliveroo)", value: true },
            { "@type": "LocationFeatureSpecification", name: "Cocktails", value: true },
        ],
        potentialAction: [
            {
                "@type": "ReserveAction",
                target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/contact#reservations`, inLanguage: "en-IE" },
                result: { "@type": "FoodEstablishmentReservation", name: "Table reservation at Kin Dee" },
            },
            {
                "@type": "OrderAction",
                target: { "@type": "EntryPoint", urlTemplate: DELIVEROO_URL },
            },
        ],
    };
}

export function websiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "en-IE",
        publisher: { "@id": RESTAURANT_ID },
    };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{ name: "Home", path: "/" }, ...trail].map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: absoluteUrl(c.path),
        })),
    };
}

export function webPageJsonLd(opts: { path: string; name: string; description: string; type?: string }) {
    return {
        "@context": "https://schema.org",
        "@type": opts.type ?? "WebPage",
        "@id": `${absoluteUrl(opts.path)}#webpage`,
        url: absoluteUrl(opts.path),
        name: opts.name,
        description: opts.description,
        inLanguage: "en-IE",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": RESTAURANT_ID },
    };
}

export function wineListJsonLd(data: SiteData) {
    const groups = groupWines(data);
    if (!groups.length) return null;
    const offer = (w: WineItem) =>
        [
            priceNumber(w.price_glass) && {
                "@type": "Offer",
                name: "Glass",
                price: priceNumber(w.price_glass),
                priceCurrency: "EUR",
            },
            priceNumber(w.price_bottle) && {
                "@type": "Offer",
                name: w.size || "Bottle",
                price: priceNumber(w.price_bottle),
                priceCurrency: "EUR",
            },
        ].filter(Boolean);
    return {
        "@context": "https://schema.org",
        "@type": "Menu",
        "@id": `${SITE_URL}/wine-list#menu`,
        name: "Kin Dee Wine List",
        url: `${SITE_URL}/wine-list`,
        inLanguage: "en-IE",
        hasMenuSection: groups.map((g) => ({
            "@type": "MenuSection",
            name: g.label,
            hasMenuItem: g.items.map((w) => ({
                "@type": "MenuItem",
                name: w.name,
                description: w.origin || undefined,
                offers: offer(w),
            })),
        })),
    };
}

export function galleryJsonLd(data: SiteData) {
    if (!data.galleryImages.length) return null;
    return {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "@id": `${SITE_URL}/gallery#gallery`,
        name: "Kin Dee food and restaurant gallery",
        url: `${SITE_URL}/gallery`,
        about: { "@id": RESTAURANT_ID },
        image: data.galleryImages.map((g) => ({
            "@type": "ImageObject",
            contentUrl: seoImage("gallery", g.alt_text, g.id, g.image_url),
            name: g.alt_text ? `${g.alt_text} at Kin Dee, Dublin` : "Dish at Kin Dee, Dublin",
            caption: g.alt_text || undefined,
        })),
    };
}

/* ------------------------------------------------------------------ */
/* FAQ — written from live data so answers never drift from the site   */
/* ------------------------------------------------------------------ */

export function buildFaqs(data: SiteData): { question: string; answer: string }[] {
    const phone = contactPhone(data.settings);
    const hours = hoursSentence(data.hours);
    const menuNames = data.menus.filter((m) => m.is_visible !== false).map((m) => m.title);
    const special = data.specialMenus.find((m) => m.is_active);
    const specialLabel = special ? getSpecialMenuTypeConfig(special.type)?.label : null;
    const early = data.menus.find((m) => /neighbourhood/i.test(m.title) && m.description);

    const faqs = [
        {
            question: "Where is Kin Dee?",
            answer: `Kin Dee is at ${ADDRESS_LINE}, on Leeson Street Upper near Ranelagh and Ballsbridge.`,
        },
        hours && {
            question: "What are Kin Dee's opening hours?",
            answer: hours,
        },
        {
            question: "What kind of food does Kin Dee serve?",
            answer:
                "South East Asian cuisine: Thai classics such as Phad Thai, curries and larb alongside modern Asian fusion dishes, made with Irish produce like Wicklow pork, Irish beef and Dublin Bay prawns. Vegan and vegetarian options are available.",
        },
        {
            question: "How do I book a table at Kin Dee?",
            answer: `Book online on our Contact & Reservations page (${SITE_URL}/contact#reservations) or call ${phone}.`,
        },
        menuNames.length > 0 && {
            question: "Which menus does Kin Dee have?",
            answer: `${menuNames.join(", ")}${special ? `, plus a seasonal ${special.title}` : ""}. You can view them all at ${SITE_URL}/menu.`,
        },
        early && {
            question: `What is the ${early.title}?`,
            answer: early.description!.replace(/\s+/g, " ").trim(),
        },
        special && {
            question: `Does Kin Dee have a ${specialLabel ?? "special"} menu?`,
            answer: `Yes, the ${special.title}${special.description ? `: ${special.description.replace(/\s+/g, " ").trim()}` : ""}${special.price_text ? ` (${special.price_text})` : ""}. See ${SITE_URL}/menu.`,
        },
        {
            question: "Does Kin Dee do takeaway or delivery?",
            answer: `Yes. Call ${phone} to order takeaway, or order delivery through Deliveroo.`,
        },
        {
            question: "Can Kin Dee cater for allergies and dietary requirements?",
            answer:
                "Yes. Every dish on our menus is labelled with the 14 EU allergens, and vegan and vegetarian options are available. Please tell your server about any allergies or dietary requirements.",
        },
        {
            question: "Does Kin Dee sell gift vouchers?",
            answer: `Yes, gift vouchers can be bought online at ${VOUCHER_URL}.`,
        },
        {
            question: "Does Kin Dee offer catering or private events?",
            answer: `Yes. Kin Dee caters for parties and corporate events in Dublin, from party pots to finger food and full-service menus. Details at ${SITE_URL}/catering.`,
        },
    ];
    return faqs.filter(Boolean) as { question: string; answer: string }[];
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${SITE_URL}/contact#faq`,
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
    };
}

/* ------------------------------------------------------------------ */
/* Per-page <head> metadata                                           */
/* ------------------------------------------------------------------ */


export function pageMetadata(opts: { path: string; title: string; description: string; keywords?: string[] }): Metadata {
    const url = absoluteUrl(opts.path);
    return {
        title: opts.title,
        description: opts.description,
        keywords: opts.keywords,
        alternates: { canonical: opts.path },
        openGraph: {
            type: "website",
            locale: "en_IE",
            url,
            siteName: "Kin Dee Restaurant",
            title: `${opts.title} | Kin Dee Dublin`,
            description: opts.description,
            images: [SHARE_IMAGE],
        },
        twitter: {
            card: "summary_large_image",
            title: `${opts.title} | Kin Dee Dublin`,
            description: opts.description,
            images: [SHARE_IMAGE.url],
        },
    };
}
