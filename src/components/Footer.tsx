import { Facebook, Instagram, Star } from "lucide-react";
import {
    ADDRESS_LINE,
    GOOGLE_REVIEWS_URL,
    MAPS_URL,
    VOUCHER_URL,
    contactEmail,
    contactPhone,
    socialLinks,
} from "@/lib/seo";
import type { SiteSettings } from "@/lib/siteData";

type BusinessHour = { id: string; day_range: string; hours: string };

interface FooterProps {
    hours?: BusinessHour[];
    settings?: SiteSettings | null;
}

const PAGE_LINKS = [
    { href: "/menu", label: "Menus" },
    { href: "/wine-list", label: "Wine List" },
    { href: "/about", label: "About Us" },
    { href: "/gallery", label: "Gallery" },
    { href: "/catering", label: "Catering & Events" },
    { href: "/contact#reservations", label: "Book a Table" },
    { href: "/contact", label: "Contact & FAQ" },
];

const Footer = ({ hours = [], settings }: FooterProps) => {
    const currentYear = new Date().getFullYear();
    const socials = socialLinks(settings ?? null);
    const phone = contactPhone(settings ?? null);
    const email = contactEmail(settings ?? null);

    return (
        <footer className="bg-foreground text-primary-foreground">
            <div className="container-custom py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <p className="font-display font-bold text-3xl mb-4 uppercase tracking-widest">Kin Dee</p>
                        <p className="text-primary-foreground/70 max-w-md mb-6">
                            South East Asian restaurant on Leeson Street Upper, Dublin 4. Thai classics and modern
                            Asian fusion made with Irish produce, cocktails and a curated wine list.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <a
                                href={socials.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                aria-label="Kin Dee on Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href={socials.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                aria-label="Kin Dee on Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href={GOOGLE_REVIEWS_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-primary-foreground/10 text-sm hover:bg-primary transition-all duration-300"
                            >
                                <Star className="w-4 h-4 fill-current text-gold" /> Read our Google reviews
                            </a>
                        </div>
                    </div>

                    {/* Pages */}
                    <nav aria-label="Footer">
                        <p className="font-display text-lg mb-4">Explore</p>
                        <ul className="space-y-3">
                            {PAGE_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <a
                                    href={VOUCHER_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                                >
                                    Gift Vouchers
                                </a>
                            </li>
                        </ul>
                    </nav>

                    {/* Hours + contact */}
                    <div>
                        <p className="font-display text-lg mb-4">Opening Hours</p>
                        {hours.length > 0 && (
                            <ul className="space-y-2 text-primary-foreground/70">
                                {hours.map((h) => (
                                    <li key={h.id}>
                                        {h.day_range}: {h.hours}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <address className="mt-6 not-italic text-sm space-y-1">
                            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="block text-primary-foreground/60 hover:text-primary-foreground">
                                {ADDRESS_LINE}
                            </a>
                            <a href={`tel:${phone.replace(/\s+/g, "")}`} className="block text-primary-foreground/70 hover:text-primary-foreground">
                                {phone}
                            </a>
                            <a href={`mailto:${email}`} className="block text-primary-foreground/70 hover:text-primary-foreground">
                                {email}
                            </a>
                        </address>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-primary-foreground/50">© {currentYear} Kin Dee Restaurant. All rights reserved.</p>
                    <p className="text-sm text-primary-foreground/50">South East Asian Restaurant · Leeson Street Upper · Dublin 4</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
