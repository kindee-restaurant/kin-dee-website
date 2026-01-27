"use client";

import { useEffect, useRef } from "react";
import { Phone, Clock, MapPin } from "lucide-react";

type BusinessHour = { id: string; day_range: string; hours: string };

interface ReservationsProps {
    settings?: {
        contact_phone?: string;
        contact_address?: string;
    } | null;
    hours?: BusinessHour[];
}

const Reservations = ({ settings, hours = [] }: ReservationsProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptLoaded = useRef(false);

    const contactPhone = settings?.contact_phone || "+353 1 765 4321";
    const contactAddress = settings?.contact_address || "133 Leeson Street Upper, Dublin 4, D04HX48";

    useEffect(() => {
        if (scriptLoaded.current) return;

        // Clear container first
        if (containerRef.current) {
            containerRef.current.innerHTML = "";
        }

        // Load OpenTable widget script
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "//www.opentable.ie/widget/reservation/loader?rid=466095&type=wide&theme=standard&color=8&dark=false&iframe=true&domain=ie&lang=en-IE&newtab=false&ot_source=Restaurant%20website&font=arialBlack&ot_logo=standard&primary_color=f2ede3&primary_font_color=333333&button_color=2a2622&button_font_color=ffffff&cfe=true";

        if (containerRef.current) {
            containerRef.current.appendChild(script);
            scriptLoaded.current = true;
        }

        // No cleanup needed for script injection as it persists, but we clear innerHTML on mount if needed
    }, []);

    const formattedHours = hours.length > 0 ? hours : [
        { id: "1", day_range: "Mon - Thu", hours: "5pm - 10pm" },
        { id: "2", day_range: "Fri - Sat", hours: "5pm - 11pm" },
        { id: "3", day_range: "Sunday", hours: "1pm - 9pm" },
    ];

    return (
        <section id="reservations" className="section-padding bg-cream overflow-hidden min-h-[700px] flex items-center">
            <div className="container-custom w-full max-w-6xl px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-y-8 lg:gap-x-20 items-start">

                    {/* Intro Section - Mobile: 1st, Desktop: 1st Col Top */}
                    <div className="order-1 lg:order-none animate-fade-in text-center lg:text-left lg:col-start-1 lg:row-start-1">
                        <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-4">Reservations</p>
                        <h2 className="heading-section text-foreground mb-6">
                            Book Your <em>Table</em>
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Immerse yourself in the authentic flavors of Thailand. Whether it's an intimate dinner or a celebration with friends, we look forward to welcoming you.
                        </p>
                    </div>

                    {/* Widget - Mobile: 2nd, Desktop: 2nd Col (Span 2) */}
                    <div className="order-2 lg:order-none w-full lg:col-start-2 lg:row-start-1 lg:row-span-2 flex justify-center lg:justify-end">
                        <div
                            ref={containerRef}
                            className="w-full flex justify-center lg:justify-end"
                        >
                            <noscript>
                                <div className="bg-card p-8 rounded-xl border text-center w-full">
                                    <p className="text-muted-foreground">
                                        Please enable JavaScript to make a reservation online, or call us directly.
                                    </p>
                                </div>
                            </noscript>
                        </div>
                    </div>

                    {/* Details Section - Mobile: 3rd, Desktop: 1st Col Bottom */}
                    <div className="order-3 lg:order-none animate-fade-in text-center lg:text-left lg:col-start-1 lg:row-start-2">
                        <div className="grid gap-6 max-w-sm mx-auto lg:mx-0">
                            {/* Hours Block */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 flex-shrink-0 mt-1">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-display text-lg mb-1">Opening Hours</p>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        {formattedHours.map((h, i) => (
                                            <p key={h.id || i}><span className="font-medium">{h.day_range}:</span> {h.hours}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Phone Block */}
                            <a href={`tel:${contactPhone}`} className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 flex-shrink-0">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-display text-lg">Call Us</p>
                                    <p className="text-sm text-muted-foreground mt-1">{contactPhone}</p>
                                </div>
                            </a>

                            {/* Location Block */}
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 flex-shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-display text-lg">Location</p>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line mt-1">{contactAddress}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Reservations;
