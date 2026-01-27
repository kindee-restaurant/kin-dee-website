import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Menu from "@/components/Menu";
import WineList from "@/components/WineList";
import Gallery from "@/components/Gallery";
import Reservations from "@/components/Reservations";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

// Server-side data fetching for SEO
async function getPageData() {
    const supabase = await createClient();

    const [
        { data: heroData },
        { data: categories },
        { data: menuItems },
        { data: wineCategories },
        { data: wineItems },
        { data: galleryImages },
        { data: hours },
        { data: settings },
    ] = await Promise.all([
        supabase.from("hero_section").select("*").single(),
        supabase.from("categories").select("*").order("display_order"),
        supabase.from("menu_items").select("*").order("display_order"),
        supabase.from("wine_categories").select("*").order("display_order"),
        supabase.from("wine_items").select("*").order("display_order"),
        supabase.from("gallery_images").select("*").order("display_order"),
        supabase.from("business_hours").select("*").order("display_order"),
        supabase.from("site_settings").select("*").single(),
    ]);

    // Group menu items by category
    const menuData: Record<string, typeof menuItems> = {};
    categories?.forEach((cat) => {
        menuData[cat.slug] = menuItems?.filter((item) => item.category_id === cat.id) || [];
    });

    // Group wine items by category
    const wineData: Record<string, typeof wineItems> = {};
    wineCategories?.forEach((cat) => {
        wineData[cat.slug] = wineItems?.filter((item) => item.category_id === cat.id) || [];
    });

    return {
        heroData,
        categories: categories || [],
        menuData,
        wineCategories: wineCategories || [],
        wineData,
        galleryImages: galleryImages || [],
        hours: hours || [],
        settings,
    };
}

export default async function HomePage() {
    const data = await getPageData();

    return (
        <main className="min-h-screen">
            <Header />
            <Hero data={data.heroData} />
            <About settings={data.settings} />
            <Menu categories={data.categories} menuData={data.menuData} />
            <WineList categories={data.wineCategories} wineData={data.wineData} />
            <Gallery images={data.galleryImages} />
            <Reservations settings={data.settings} hours={data.hours} />
            <Contact settings={data.settings} hours={data.hours} />
            <Footer hours={data.hours} settings={data.settings} />
        </main>
    );
}
