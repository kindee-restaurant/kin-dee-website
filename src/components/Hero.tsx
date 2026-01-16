import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import heroFood from "@/assets/hero-image.png";

const Hero = () => {
    const [scrollY, setScrollY] = useState(0);
    const [heroData, setHeroData] = useState({
        title: "Where Thai Tradition Meets Modern Fusion",
        subtitle: "Thai & Asian Fusion / Leeson Street Upper, Dublin",
        image_url: heroFood,
        button_text: "Reserve Your Table"
    });

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        // Fetch hero data
        import("@/integrations/supabase/client").then(({ supabase }) => {
            supabase.from("hero_section").select("*").limit(1).single()
                .then(({ data }) => {
                    if (data) {
                        setHeroData(prev => ({
                            title: data.title || prev.title,
                            subtitle: data.subtitle || prev.subtitle,
                            image_url: data.image_url || prev.image_url,
                            button_text: data.button_text || prev.button_text
                        }));
                    }
                });
        });
    }, []);

    const parallaxOffset = scrollY * 0.4;
    const opacityFade = Math.max(0, 1 - scrollY / 600);
    const scaleEffect = 1 + scrollY * 0.0003;

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Parallax */}
            <div
                className="absolute inset-0 z-0"
                style={{ transform: `translateY(${parallaxOffset}px) scale(${scaleEffect})` }}
            >
                <img
                    src={heroData.image_url}
                    alt="Exquisite Thai cuisine at Kin Dee Dublin"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />
            </div>

            {/* Content with fade on scroll */}
            <div
                className="relative z-10 container-custom text-center pt-20"
                style={{ opacity: opacityFade, transform: `translateY(${scrollY * 0.2}px)` }}
            >
                <div className="max-w-4xl mx-auto">
                    <p className="font-body text-sm md:text-base uppercase tracking-[0.3em] text-sage-light mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        {heroData.subtitle}
                    </p>

                    <h1 className="heading-display text-primary-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                        {heroData.title}
                    </h1>

                    <p className="text-body text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.6s" }}>
                        Experience the authentic flavours of Thailand reimagined with contemporary Asian influences,
                        in the heart of Dublin's most vibrant dining district.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.8s" }}>
                        <Button variant="hero" size="xl" asChild>
                            <a href="#reservations">{heroData.button_text}</a>
                        </Button>
                        <Button variant="hero-outline" size="xl" asChild>
                            <a href="#menu">View Our Menu</a>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float"
                style={{ opacity: opacityFade }}
            >
                <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2 animate-pulse" />
                </div>
            </div>
        </section>
    );
};

export default Hero;
