import { useEffect, useRef, useState } from "react";
import { Phone, Clock, MapPin } from "lucide-react";

const Reservations = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hours, setHours] = useState<any[]>([]);
    // Default settings fallback
    const [settings, setSettings] = useState<any>({
        contact_phone: "+353 1 765 4321",
        contact_address: "133 Leeson Street Upper, Dublin 4, D04HX48"
    });

    // Fetch Data
    useEffect(() => {
        import("@/integrations/supabase/client").then(({ supabase }) => {
            // Fetch Hours
            supabase.from("business_hours").select("*").order("display_order")
                .then(({ data }) => { if (data) setHours(data); });

            // Fetch Settings
            supabase.from("site_settings").select("*").single()
                .then(({ data }) => { if (data) setSettings(data); });
        });
    }, []);

    // Load Widget
    useEffect(() => {
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
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
            }
        };
    }, []);

    return (
        <section id="reservations" className="section-padding bg-cream overflow-hidden min-h-[700px] flex items-center">
            <div className="container-custom w-full max-w-6xl px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Content */}
                    <div className="animate-fade-in order-1 lg:order-1 text-center lg:text-left">
                        <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-4">Reservations</p>
                        <h2 className="heading-section text-foreground mb-6">
                            Book Your <em>Table</em>
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Immerse yourself in the authentic flavors of Thailand. Whether it's an intimate dinner or a celebration with friends, we look forward to welcoming you.
                        </p>

                        <div className="grid gap-6 max-w-sm mx-auto lg:mx-0">
                            {/* Hours Block */}
                            <div className="flex items-start gap-4 justify-center lg:justify-start group">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 flex-shrink-0">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-display text-lg mb-1">Opening Hours</p>
                                    <div className="text-sm text-muted-foreground space-y-0.5">
                                        {hours.length > 0 ? (
                                            hours.map(h => (
                                                <p key={h.id}><span className="font-medium">{h.day_range}:</span> {h.hours}</p>
                                            ))
                                        ) : (
                                            <>
                                                <p>Mon - Thu: 5pm - 10pm</p>
                                                <p>Fri - Sat: 5pm - 11pm</p>
                                                <p>Sunday: 1pm - 9pm</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Phone Block */}
                            <a href={`tel:${settings?.contact_phone}`} className="flex items-center gap-4 justify-center lg:justify-start group">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 flex-shrink-0">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-display text-lg">Call Us</p>
                                    <p className="text-sm text-muted-foreground">{settings?.contact_phone}</p>
                                </div>
                            </a>

                            {/* Location Block */}
                            <div className="flex items-center gap-4 justify-center lg:justify-start group">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 flex-shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-display text-lg">Location</p>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">{settings?.contact_address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Widget */}
                    <div className="order-2 lg:order-2 w-full">
                        <div
                            ref={containerRef}
                            className="w-full flex justify-center lg:justify-end"
                        >
                            {/* OpenTable widget injected here */}
                            <noscript>
                                <div className="bg-card p-8 rounded-xl border text-center w-full">
                                    <p className="text-muted-foreground">
                                        Please enable JavaScript to make a reservation online, or call us directly.
                                    </p>
                                </div>
                            </noscript>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default Reservations;
