import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
    const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.3 });
    const { ref: mapRef, isVisible: mapVisible } = useScrollAnimation({ threshold: 0.2 });
    const { ref: infoRef, isVisible: infoVisible } = useScrollAnimation({ threshold: 0.2 });

    const [settings, setSettings] = useState<any>(null);
    const [hours, setHours] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            // Settings
            const { data: settingsData } = await supabase.from("site_settings").select("*").single();
            if (settingsData) setSettings(settingsData);

            // Hours
            const { data: hoursData } = await supabase.from("business_hours").select("*").order("display_order");
            if (hoursData) setHours(hoursData);
        };
        fetchData();
    }, []);

    return (
        <section id="contact" className="section-padding bg-cream overflow-hidden">
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
                        Find Us
                    </p>
                    <h2 className="heading-section text-foreground mb-4">
                        Visit <em>Kin Dee</em>
                    </h2>
                    <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                        Located in the heart of Dublin on prestigious Leeson Street,
                        we're easily accessible from the city centre.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Map */}
                    <div
                        ref={mapRef}
                        className={cn(
                            "rounded-lg overflow-hidden shadow-elevated h-[400px] transition-all duration-1000",
                            mapVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
                        )}
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2382.0892!2d-6.2568!3d53.3331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48670e9f54f54557%3A0x7d8d891b98e6c8f6!2sLeeson%20Street%2C%20Dublin!5e0!3m2!1sen!2sie!4v1699999999999!5m2!1sen!2sie"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Kin Dee Restaurant Location - Leeson Street, Dublin"
                        />
                    </div>

                    {/* Contact Info */}
                    <div
                        ref={infoRef}
                        className={cn(
                            "space-y-8 transition-all duration-1000 delay-200",
                            infoVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
                        )}
                    >
                        <div className="flex items-start gap-5">
                            <div className="w-14 h-14 rounded-full bg-sage-light flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-display text-xl text-foreground mb-2">Address</h3>
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {settings?.contact_address || "Leeson Street, Dublin 2, D02, Ireland"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <div className="w-14 h-14 rounded-full bg-sage-light flex items-center justify-center flex-shrink-0">
                                <Phone className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-display text-xl text-foreground mb-2">Phone</h3>
                                <a href={`tel:${settings?.contact_phone || "+35317654321"}`} className="text-muted-foreground hover:text-primary transition-colors">
                                    {settings?.contact_phone || "+353 1 765 4321"}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <div className="w-14 h-14 rounded-full bg-sage-light flex items-center justify-center flex-shrink-0">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-display text-xl text-foreground mb-2">Email</h3>
                                <a href={`mailto:${settings?.contact_email || "hello@kindee.ie"}`} className="text-muted-foreground hover:text-primary transition-colors">
                                    {settings?.contact_email || "hello@kindee.ie"}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <div className="w-14 h-14 rounded-full bg-sage-light flex items-center justify-center flex-shrink-0">
                                <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-display text-xl text-foreground mb-2">Opening Hours</h3>
                                <div className="text-muted-foreground space-y-1">
                                    {hours.length > 0 ? hours.map((h: any) => (
                                        <p key={h.id}>{h.day_range}: {h.hours}</p>
                                    )) : (
                                        <>
                                            <p>Monday - Thursday: 5:00 PM - 10:00 PM</p>
                                            <p>Friday - Saturday: 5:00 PM - 11:00 PM</p>
                                            <p>Sunday: 1:00 PM - 9:00 PM</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
