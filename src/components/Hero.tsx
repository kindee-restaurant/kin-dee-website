"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroFood from "@/assets/hero-image.png";

interface HeroProps {
    data?: {
        title?: string;
        subtitle?: string;
        image_url?: string;
        button_text?: string;
    } | null;
    /** Short festive announcement shown above the title, linking to the special menu. */
    festiveBadge?: string;
}

const Hero = ({ data, festiveBadge }: HeroProps) => {
    const [scrollY, setScrollY] = useState(0);

    const heroData = {
        title: data?.title || "Where Tradition Meets Modern Fusion",
        subtitle: data?.subtitle || "South East Asian Cuisine / Leeson Street Upper, Dublin",
        image_url: data?.image_url || heroFood,
        button_text: data?.button_text || "Reserve Your Table",
    };

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
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
                <Image
                    src={heroData.image_url}
                    alt="Exquisite Thai cuisine at Kin Dee Dublin"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />
            </div>

            {/* Content with fade on scroll */}
            <div
                className={`relative z-10 container-custom text-center pb-44 md:pb-0 ${festiveBadge ? "pt-32 md:pt-24" : "pt-20"}`}
                style={{ opacity: opacityFade, transform: `translateY(${scrollY * 0.2}px)` }}
            >
                <div className="max-w-4xl mx-auto">
                    {festiveBadge && (
                        <a
                            href="#special-menu"
                            className="inline-flex items-center gap-2 mb-5 sm:mb-6 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#d4a83a]/70 bg-[#123524]/90 backdrop-blur-sm text-[#f6e7bf] font-festive text-[10px] sm:text-xs font-semibold tracking-[0.14em] sm:tracking-[0.18em] uppercase shadow-md hover:bg-[#123524] hover:border-[#d4a83a] transition-colors animate-fade-in"
                        >
                            <span aria-hidden="true" className="text-[#c9a14a]">✦</span> {festiveBadge} <span aria-hidden="true" className="text-[#c9a14a]">✦</span>
                        </a>
                    )}
                    <p className="font-body text-sm md:text-base uppercase tracking-[0.3em] text-sage-light mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        {heroData.subtitle}
                    </p>

                    <h1 className="heading-display text-primary-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                        {heroData.title}
                    </h1>

                    <p className="text-body text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.6s" }}>
                        Experience the authentic flavours of South East Asia reimagined with contemporary influences,
                        in the heart of Dublin's most vibrant dining district.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.8s" }}>
                        <Button variant="hero" size="xl" asChild>
                            <a href="#reservations">{heroData.button_text}</a>
                        </Button>
                        <Button variant="voucher" size="xl" className="md:hidden" asChild>
                            <a href="https://kindee.giftsmart.ie/" target="_blank" rel="noopener noreferrer">
                                <Gift className="w-5 h-5" /> Buy a Voucher
                            </a>
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
