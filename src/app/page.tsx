import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Menu from "@/components/Menu";
import WineList from "@/components/WineList";
import Gallery from "@/components/Gallery";
import Reservations from "@/components/Reservations";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { MenuSchema, FAQSchema } from "@/components/seo";
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
        { data: allergensData },
        { data: menuItemAllergens },
    ] = await Promise.all([
        supabase.from("hero_section").select("*").single(),
        supabase.from("categories").select("*").order("display_order"),
        supabase.from("menu_items").select("*").order("display_order"),
        supabase.from("wine_categories").select("*").order("display_order"),
        supabase.from("wine_items").select("*").order("display_order"),
        supabase.from("gallery_images").select("*").order("display_order"),
        supabase.from("business_hours").select("*").order("display_order"),
        supabase.from("site_settings").select("*").single(),
        supabase.from("allergens").select("*").order("display_order"),
        supabase.from("menu_item_allergens").select("*"),
    ]);

    // Group menu items by category
    const menuData: Record<string, NonNullable<typeof menuItems>> = {};
    categories?.forEach((cat) => {
        menuData[cat.slug] = menuItems?.filter((item) => item.category_id === cat.id) || [];
    });

    // Group wine items by category
    const wineData: Record<string, NonNullable<typeof wineItems>> = {};
    wineCategories?.forEach((cat) => {
        wineData[cat.slug] = wineItems?.filter((item) => item.category_id === cat.id) || [];
    });

    // Build allergen map: menu_item_id -> array of allergen number labels
    const allergenMap: Record<string, string[]> = {};
    if (menuItemAllergens && allergensData) {
        menuItemAllergens.forEach((mia: { menu_item_id: string; allergen_id: string }) => {
            const allergen = allergensData.find((a: { id: string }) => a.id === mia.allergen_id);
            if (allergen) {
                if (!allergenMap[mia.menu_item_id]) allergenMap[mia.menu_item_id] = [];
                allergenMap[mia.menu_item_id].push(allergen.number);
            }
        });
    }

    return {
        heroData,
        categories: categories || [],
        menuData,
        wineCategories: wineCategories || [],
        wineData,
        galleryImages: galleryImages || [],
        hours: hours || [],
        settings,
        allergens: allergensData || [],
        allergenMap,
    };
}

export default async function HomePage() {
    const data = await getPageData();
    console.log("Server Page Data - Settings:", data.settings);

    return (
        <main className="min-h-screen">
            {/* SEO Structured Data */}
            <MenuSchema categories={data.categories} menuData={data.menuData} />
            <FAQSchema />

            <Header />
            <Hero data={data.heroData} />
            <About settings={data.settings} />
            <Menu categories={data.categories} menuData={data.menuData} allergens={data.allergens} allergenMap={data.allergenMap} />
            <WineList categories={data.wineCategories} wineData={data.wineData} />
            <Gallery images={data.galleryImages} />
            <Reservations settings={data.settings} hours={data.hours} />
            <Contact settings={data.settings} hours={data.hours} />
            <Footer hours={data.hours} settings={data.settings} />
        </main>
    );
}

