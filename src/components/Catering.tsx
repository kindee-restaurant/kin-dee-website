"use client";

import Image from "next/image";
import { Utensils, ChefHat, Users, Phone } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import cateringImage from "@/assets/menu-thai-classics.jpg"; // Reusing an existing high-quality image

interface CateringProps {
    settings?: {
        contact_phone?: string;
        contact_email?: string;
    } | null;
}

const Catering = ({ settings }: CateringProps) => {
    const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.3 });
    const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation({ threshold: 0.2 });
    const { ref: infoRef, isVisible: infoVisible } = useScrollAnimation({ threshold: 0.2 });

    const contactPhone = settings?.contact_phone || "+353 1 963 6162";

    return (
        <section id="catering" className="section-padding bg-background overflow-hidden border-t border-border">
            <div className="container-custom">
                {/* Header */}
                <div
                    ref={headerRef}
                    className={cn(
                        "text-center mb-12 transition-all duration-1000",
                        headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    )}
                >
                    <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-4">
                        Events & Gatherings
                    </p>
                    <h2 className="heading-section text-foreground mb-4">
                        Kin Dee <em>Catering</em>
                    </h2>
                    <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                        Bring the authentic taste of Thailand to your next event. From corporate functions to intimate home gatherings, our customized catering services are designed to ensure your guests "Eat Well".
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Information / Packages */}
                    <div
                        ref={infoRef}
                        className={cn(
                            "space-y-8 transition-all duration-1000 delay-200 order-2 lg:order-1",
                            infoVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
                        )}
                    >
                        <div className="space-y-6">
                            <h3 className="font-display text-2xl text-foreground">Flexible Catering Packages</h3>
                            
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                    <Utensils className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-display text-lg mb-1">Party Pots & Self-Service</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Perfect for office lunches or casual events. We provide our signature curries and dishes in professional hot-holding tureens for easy self-service.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-display text-lg mb-1">Pass-Around Finger Food</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Elevate your reception or cocktail hour with our selection of artisanal Thai canapés, spring rolls, and skewers.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                    <ChefHat className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-display text-lg mb-1">Full Service Menus</h4>
                                    <p className="text-muted-foreground text-sm">
                                        For weddings and special celebrations, let our team craft a bespoke sit-down menu featuring our most celebrated dishes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border">
                            <p className="text-foreground font-medium mb-4">Contact our team today to build your custom menu.</p>
                            <a
                                href={`tel:${contactPhone}`}
                                className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-body text-sm uppercase tracking-wider hover:bg-primary/90 transition-all duration-300 shadow-soft hover:shadow-elevated"
                            >
                                <Phone className="w-4 h-4" />
                                Request a Quote
                            </a>
                        </div>
                    </div>

                    {/* Image */}
                    <div
                        ref={imageRef}
                        className={cn(
                            "relative aspect-[4/3] rounded-xl overflow-hidden shadow-elevated transition-all duration-1000 order-1 lg:order-2",
                            imageVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
                        )}
                    >
                        <Image
                            src={cateringImage}
                            alt="Kin Dee Catering Spread"
                            fill
                            className="object-cover transition-all duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <p className="text-white font-display text-2xl font-medium drop-shadow-md">
                                Unforgettable Flavors for Every Occasion
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Catering;
