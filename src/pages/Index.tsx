import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Menu from "@/components/Menu";
import WineList from "@/components/WineList";
import Gallery from "@/components/Gallery";
import Reservations from "@/components/Reservations";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
    useEffect(() => {
        const updateSEO = async () => {
            const { data } = await supabase.from("site_settings").select("seo_title, seo_description").single();
            if (data) {
                if (data.seo_title) document.title = data.seo_title;
                if (data.seo_description) {
                    let metaDescription = document.querySelector('meta[name="description"]');
                    if (!metaDescription) {
                        metaDescription = document.createElement('meta');
                        metaDescription.setAttribute('name', 'description');
                        document.head.appendChild(metaDescription);
                    }
                    metaDescription.setAttribute('content', data.seo_description);
                }
            }
        };
        updateSEO();
    }, []);

    return (
        <main className="min-h-screen">
            <Header />
            <Hero />
            <About />
            <Menu />
            <WineList />
            <Gallery />
            <Reservations />
            <Contact />
            <Footer />
        </main>
    );
};

export default Index;
