"use client";

import { Phone } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FloatingCTAsProps {
    contactPhone?: string;
    deliverooLink?: string;
}

const FloatingCTAs = ({ contactPhone = "+353 1 963 6162", deliverooLink = "https://deliveroo.ie/menu/Dublin/ballsbridge-d4/kin-dee-indochine" }: FloatingCTAsProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after a short delay so it doesn't pop in immediately
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes float-pop {
                    0% { transform: translateY(0) scale(1); }
                    33% { transform: translateY(-4px) scale(1.03); }
                    66% { transform: translateY(0) scale(1); }
                    100% { transform: translateY(0) scale(1); }
                }
                .animate-cta-1 { animation: float-pop 2.5s ease-in-out infinite; }
                .animate-cta-2 { animation: float-pop 2.5s ease-in-out infinite 1.25s; }
                .animate-cta-1:hover, .animate-cta-2:hover { animation-play-state: paused; }
            `}} />
            <div className="fixed bottom-4 left-0 right-0 z-50 pointer-events-none px-3 sm:px-6 w-full max-w-[100vw]">
            <div className="container-custom relative w-full h-full mx-auto flex justify-between items-end gap-2">
                
                {/* Take Away / Call CTA (Bottom Left) */}
                <div className={cn(
                    "pointer-events-auto transition-all duration-1000 transform origin-bottom-left",
                    isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
                )}>
                    <a
                        href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                        className="animate-cta-1 group flex items-center gap-2 sm:gap-2.5 bg-foreground text-background px-3 py-2 sm:px-5 sm:py-3.5 rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] border border-border/50 hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:scale-105 transition-all duration-300"
                        aria-label="Call to order take away"
                    >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-background" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display text-[10px] sm:text-xs uppercase tracking-wider text-background/80 leading-none mb-0.5">Take Away</span>
                            <span className="font-body text-xs sm:text-sm font-medium leading-none">Call to Order</span>
                        </div>
                    </a>
                </div>

                {/* Deliveroo CTA (Bottom Right) */}
                <div className={cn(
                    "pointer-events-auto transition-all duration-1000 delay-150 transform origin-bottom-right",
                    isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
                )}>
                    <a
                        href={deliverooLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="animate-cta-2 group flex items-center gap-2 sm:gap-2.5 bg-[#00CCBC] text-white px-3 py-2 sm:px-5 sm:py-3.5 rounded-full shadow-[0_4px_14px_0_rgba(0,204,188,0.39)] border border-[#00CCBC]/50 hover:shadow-[0_6px_20px_rgba(0,204,188,0.39)] hover:scale-105 transition-all duration-300"
                        aria-label="Order on Deliveroo"
                    >
                        <div className="flex flex-col items-end text-right">
                            <span className="font-display text-[10px] sm:text-xs uppercase tracking-wider text-white/90 leading-none mb-0.5">Delivery</span>
                            <span className="font-body text-xs sm:text-sm font-medium leading-none">Order Online</span>
                        </div>
                        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            {/* Deliveroo Image Logo */}
                            <Image 
                                src="/deliveroo_logo.png" 
                                alt="Deliveroo Logo" 
                                width={36} 
                                height={36} 
                                className="object-cover w-full h-full" 
                            />
                        </div>
                    </a>
                </div>

            </div>
        </div>
        </>
    );
};

export default FloatingCTAs;
