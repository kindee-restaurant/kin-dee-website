import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import WineList from "@/components/WineList";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Reservations from "@/components/Reservations";
import Catering from "@/components/Catering";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { createClient } from "@/lib/supabase/server";

async function getPageData() {
    const supabase = await createClient();

    const [
        { data: heroData },
        { data: menus },
        { data: galleryImages },
        { data: hours },
        { data: settings },
    ] = await Promise.all([
        supabase.from("hero_section").select("*").single(),
        supabase.from("menus").select("*").order("display_order"),
        supabase.from("gallery_images").select("*").order("display_order"),
        supabase.from("business_hours").select("*").order("display_order"),
        supabase.from("site_settings").select("*").single(),
    ]);

    return {
        heroData,
        menus: menus || [],
        galleryImages: galleryImages || [],
        hours: hours || [],
        settings,
    };
}

export default async function HomePage() {
    const data = await getPageData();

    return (
        <main className="min-h-screen">
            <FAQSchema />

            <Header />
            <Hero data={data.heroData} />
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