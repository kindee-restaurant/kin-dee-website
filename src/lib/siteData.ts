import { cache } from "react";
import { createClient as createCookieClient } from "@/lib/supabase/server";
import { createClient as createPlainClient } from "@supabase/supabase-js";
import type { SpecialMenu } from "@/lib/specialMenus";

export interface PdfMenu {
    id: string;
    title: string;
    slug: string;
    description?: string;
    image_url?: string;
    pdf_url?: string;
    is_visible?: boolean;
    is_special?: boolean;
    display_order?: number;
}

export interface BusinessHours {
    id: string;
    day_range: string;
    hours: string;
    display_order: number;
}

/**
 * Opening hours — the single source of truth for the footer, Contact, Reservations, schema.org, FAQ and llms.txt.
 * Matches the Google Business Profile (checked 9 Nov 2026). The `business_hours` table is out of date and has no
 * admin editor, so it is not used; update these lines when the hours change.
 */
export const OPENING_HOURS: BusinessHours[] = [
    { id: "mon", day_range: "Monday", hours: "12pm - 9pm", display_order: 1 },
    { id: "tue", day_range: "Tuesday", hours: "Closed", display_order: 2 },
    { id: "wed-thu", day_range: "Wed - Thu", hours: "12pm - 10pm", display_order: 3 },
    { id: "fri-sat", day_range: "Fri - Sat", hours: "12pm - 11pm", display_order: 4 },
    { id: "sun", day_range: "Sunday", hours: "1pm - 9pm", display_order: 5 },
];

export interface GalleryImageRow {
    id: string;
    image_url: string;
    alt_text?: string;
    display_order?: number;
}

export interface WineCategory {
    id: string;
    slug: string;
    label: string;
    display_order: number;
}

export interface WineItem {
    id: string;
    category_id: string;
    name: string;
    origin?: string;
    size?: string;
    price_glass?: string;
    price_bottle: string;
    display_order: number;
}

export interface SiteSettings {
    about_title?: string;
    about_text?: string;
    about_image?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
    social_facebook?: string;
    social_instagram?: string;
    seo_title?: string;
    seo_description?: string;
    stats_experience?: string;
    stats_dishes?: string;
    stats_rating?: string;
}

export interface HeroData {
    title?: string;
    subtitle?: string;
    image_url?: string;
    button_text?: string;
}

export interface SiteData {
    hero: HeroData | null;
    menus: PdfMenu[];
    specialMenus: SpecialMenu[];
    galleryImages: GalleryImageRow[];
    hours: BusinessHours[];
    settings: SiteSettings | null;
    wineCategories: WineCategory[];
    wineItems: WineItem[];
}

async function load(useCookies: boolean): Promise<SiteData> {
    const supabase = useCookies
        ? await createCookieClient()
        : createPlainClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
              auth: { persistSession: false },
          });

    const [hero, menus, specialMenus, gallery, settings, wineCategories, wineItems] = await Promise.all([
        supabase.from("hero_section").select("*").single(),
        supabase.from("menus").select("*").order("display_order"),
        // If the table is missing this just returns null.
        supabase.from("special_menus").select("*").eq("is_active", true).order("display_order"),
        supabase.from("gallery_images").select("*").order("display_order"),
        supabase.from("site_settings").select("*").single(),
        supabase.from("wine_categories").select("*").order("display_order"),
        supabase.from("wine_items").select("*").order("display_order"),
    ]);

    const data: SiteData = {
        hero: hero.data,
        menus: menus.data || [],
        specialMenus: (specialMenus.data || []) as SpecialMenu[],
        galleryImages: gallery.data || [],
        hours: OPENING_HOURS,
        settings: settings.data,
        wineCategories: wineCategories.data || [],
        wineItems: wineItems.data || [],
    };
    return data;
}

/** All public site content, fetched once per request (pages). */
export const getSiteData = cache(() => load(true));

/** Same content without cookies — for route handlers such as /llms.txt and the sitemap. */
export const getSiteDataPublic = () => load(false);

