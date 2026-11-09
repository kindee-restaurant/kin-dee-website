import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import SpecialMenuSection from "@/components/SpecialMenuSection";
import WineList from "@/components/WineList";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Reservations from "@/components/Reservations";
import Catering from "@/components/Catering";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Snowfall from "@/components/festive/Snowfall";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { createClient } from "@/lib/supabase/server";
import { getActiveTheme, getSpecialMenuTypeConfig, type SpecialMenu } from "@/lib/specialMenus";

async function getPageData() {
    const supabase = await createClient();

    const [
        { data: heroData },
        { data: menus },
        { data: galleryImages },
        { data: hours },
        { data: settings },
        { data: specialMenus },
    ] = await Promise.all([
        supabase.from("hero_section").select("*").single(),
        supabase.from("menus").select("*").order("display_order"),
        supabase.from("gallery_images").select("*").order("display_order"),
        supabase.from("business_hours").select("*").order("display_order"),
        supabase.from("site_settings").select("*").single(),
        // If the special_menus table hasn't been created yet this just returns null.
        supabase.from("special_menus").select("*").eq("is_active", true).order("display_order"),
    ]);

    return {
        heroData,
        menus: menus || [],
        galleryImages: galleryImages || [],
        hours: hours || [],
        settings,
        specialMenus: (specialMenus || []) as SpecialMenu[],
    };
}

export default async function HomePage() {
    const data = await getPageData();
    const theme = getActiveTheme(data.specialMenus);
    const hasSpecial = data.specialMenus.length > 0;
    const specialLabel = hasSpecial
        ? getSpecialMenuTypeConfig(data.specialMenus[0].type)?.label ?? "Special"
        : null;

    return (
        <main className={`min-h-screen ${theme ? `theme-${theme}` : ""}`}>
            <FAQSchema />

            {theme === "christmas" && <Snowfall />}

            <Header festive={theme} specialMenuLabel={specialLabel} />
            <Hero
                data={data.heroData}
                festiveBadge={theme ? getSpecialMenuTypeConfig(theme)?.heroBadge : undefined}
            />
            <SpecialMenuSection menus={data.specialMenus} />
            <Menu menus={data.menus} />
            <WineList menus={data.menus} />
            <About settings={data.settings} />
            <Gallery images={data.galleryImages} />
            <Reservations settings={data.settings} />
            <Catering settings={data.settings} />
            <Contact settings={data.settings} />
            <Footer settings={data.settings} />
        </main>
    );
}
