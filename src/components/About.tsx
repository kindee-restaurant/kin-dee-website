import restaurantInterior from "@/assets/our-story-image.jpg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
    const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
    const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation({ threshold: 0.3 });
    const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.5 });
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from("site_settings").select("*").single();
            if (data) setSettings(data);
        };
        fetchSettings();
    }, []);

    return (
        <section id="about" className="section-padding bg-cream overflow-hidden">
            <div className="container-custom">
                <div ref={sectionRef} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Image */}
                    <div
                        ref={imageRef}
                        className={cn(
                            "relative transition-all duration-1000 ease-out",
                            imageVisible
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-20"
                        )}
                    >
                        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-elevated">
                            <img
                                src={restaurantInterior}
                                alt="Elegant interior of Kin Dee Thai restaurant Dublin"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Decorative element */}
                        <div className={cn(
                            "absolute -bottom-6 -right-6 w-32 h-32 bg-sage-light rounded-lg -z-10 transition-all duration-1000 delay-300",
                            imageVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
                        )} />
                    </div>

                    {/* Content */}
                    <div className={cn(
                        "transition-all duration-1000 ease-out delay-200",
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
                    )}>
                        <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-4">
                            Our Story
                        </p>
                        <h2 className="heading-section text-foreground mb-6">
                            {settings?.about_title || <>A Culinary Journey from <em>Bangkok to Dublin</em></>}
                        </h2>
                        <div className="space-y-4 text-body text-muted-foreground whitespace-pre-line">
                            {settings?.about_text || (
                                <>
                                    <p>
                                        "Kin Dee" means "eat well" in Thai, a philosophy that guides everything we do.
                                        Founded by Chef Somchai, who trained in Bangkok's finest kitchens before bringing
                                        his passion to Ireland, Kin Dee represents the perfect harmony of tradition and innovation.
                                    </p>
                                    <p className="mt-4">
                                        Our menu celebrates authentic Thai flavours: the aromatic herbs, the careful balance
                                        of sweet, sour, salty, and spicy, while embracing influences from across Asia.
                                        From Vietnamese-inspired spring rolls to Japanese-Thai fusion creations,
                                        every dish tells a story.
                                    </p>
                                    <p className="mt-4">
                                        Located on Dublin's elegant Leeson Street Upper, our restaurant offers an intimate,
                                        refined atmosphere where you can savour exceptional cuisine crafted with
                                        the freshest ingredients and genuine passion.
                                    </p>
                                </>
                            )}
                        </div>

                        <div
                            ref={statsRef}
                            className={cn(
                                "mt-8 pt-8 border-t border-border flex gap-12 transition-all duration-700",
                                statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                            )}
                        >
                            <div className="transition-all duration-500 delay-100" style={{ transitionDelay: statsVisible ? "100ms" : "0ms" }}>
                                <p className="font-display text-4xl text-primary">{settings?.stats_experience || "15+"}</p>
                                <p className="font-body text-sm text-muted-foreground mt-1">Years Experience</p>
                            </div>
                            <div className="transition-all duration-500 delay-200" style={{ transitionDelay: statsVisible ? "200ms" : "0ms" }}>
                                <p className="font-display text-4xl text-primary">{settings?.stats_dishes || "50+"}</p>
                                <p className="font-body text-sm text-muted-foreground mt-1">Signature Dishes</p>
                            </div>
                            <div className="transition-all duration-500 delay-300" style={{ transitionDelay: statsVisible ? "300ms" : "0ms" }}>
                                <p className="font-display text-4xl text-primary">★ {settings?.stats_rating || "4.9"}</p>
                                <p className="font-body text-sm text-muted-foreground mt-1">Guest Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
