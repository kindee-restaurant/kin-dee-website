import { Facebook, Instagram } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [hours, setHours] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            // Hours
            const { data: hoursData } = await supabase.from("business_hours").select("*").order("display_order");
            if (hoursData) setHours(hoursData);

            // Settings
            const { data: settingsData } = await supabase.from("site_settings").select("*").single();
            if (settingsData) setSettings(settingsData);
        };
        fetchData();
    }, []);

    return (
        <footer className="bg-foreground text-primary-foreground">
            <div className="container-custom py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <h3 className="font-display font-bold text-3xl mb-4 uppercase tracking-widest">Kin Dee</h3>
                        <p className="text-primary-foreground/70 max-w-md mb-6">
                            Thai & Asian Fusion cuisine in the heart of Dublin.
                            Experience the authentic flavours of Thailand reimagined
                            with contemporary Asian influences.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href={settings?.social_facebook || "https://www.facebook.com/share/1CCop44kYC/"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                aria-label="Follow us on Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href={settings?.social_instagram || "https://www.instagram.com/kindeedublin"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                aria-label="Follow us on Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-display text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { href: "#about", label: "About Us" },
                                { href: "#menu", label: "Our Menu" },
                                { href: "#wines", label: "Wine List" },
                                { href: "#gallery", label: "Gallery" },
                                { href: "#reservations", label: "Book a Table" },
                                { href: "#contact", label: "Contact" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="font-display text-lg mb-4">Opening Hours</h4>
                        <ul className="space-y-2 text-primary-foreground/70">
                            {hours.length > 0 ? (
                                hours.map(h => (
                                    <li key={h.id}>{h.day_range}: {h.hours}</li>
                                ))
                            ) : (
                                <>
                                    <li>Mon - Thu: 5pm - 10pm</li>
                                    <li>Fri - Sat: 5pm - 11pm</li>
                                    <li>Sunday: 1pm - 9pm</li>
                                </>
                            )}
                        </ul>
                        <div className="mt-6">
                            <p className="text-sm text-primary-foreground/50 whitespace-pre-line">
                                {settings?.contact_address || "133 Leeson Street Upper, Dublin 4, D04HX48"}
                            </p>
                            <a href={`tel:${settings?.contact_phone || "+35317654321"}`} className="text-sm text-primary-foreground/70 hover:text-primary-foreground">
                                {settings?.contact_phone || "+353 1 765 4321"}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-primary-foreground/50">
                        © {currentYear} Kin Dee Restaurant. All rights reserved.
                    </p>
                    <p className="text-sm text-primary-foreground/50">
                        Thai Restaurant Dublin | Asian Fusion Leeson Street
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
