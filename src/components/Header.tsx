"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Star, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import ChristmasLights from "@/components/festive/ChristmasLights";
import BackToTop from "@/components/BackToTop";

interface HeaderProps {
    /** Active festive theme, if any (e.g. "christmas"). */
    festive?: string | null;
    /** Label of the live special menu (e.g. "Christmas"); adds a nav link to it. */
    specialMenuLabel?: string | null;
    /** "home" links to sections on the homepage; "page" (dedicated pages) links to the other pages and keeps the bar solid. */
    variant?: "home" | "page";
}

const Header = ({ festive = null, specialMenuLabel = null, variant = "home" }: HeaderProps) => {
    const [scrolled, setIsScrolled] = useState(false);
    const onHome = variant === "home";
    const isScrolled = !onHome || scrolled;
    /** Homepage section anchor, or the dedicated page when we're not on the homepage. */
    const to = (anchor: string, page: string) => (onHome ? anchor : page);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        ...(specialMenuLabel ? [{ href: to("#special-menu", "/menu#special-menu"), label: specialMenuLabel }] : []),
        { href: to("#about", "/about"), label: "About" },
        { href: to("#menu", "/menu"), label: "Menu" },
        { href: to("#wines", "/wine-list"), label: "Wines" },
        { href: to("#gallery", "/gallery"), label: "Gallery" },
        { href: to("#reservations", "/contact#reservations"), label: "Reservations" },
        { href: to("#contact", "/contact"), label: "Contact" },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? "bg-background/95 backdrop-blur-md shadow-soft py-3"
                : "bg-transparent py-6"
                }`}
        >
            <nav className="container-custom flex items-center justify-between">
                <a
                    href="/"
                    className={`font-display font-bold text-2xl uppercase tracking-widest transition-colors duration-300 ${isScrolled ? "text-foreground" : "text-primary-foreground"
                        }`}
                >
                    Kin Dee
                </a>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className={`font-body text-sm uppercase tracking-wider transition-colors duration-300 ${isScrolled
                                    ? "text-foreground/80 hover:text-primary"
                                    : "text-primary-foreground/90 hover:text-primary-foreground"
                                    }`}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="hidden md:block">
                    <Button variant="voucher" size="lg" asChild>
                        <a href="https://kindee.giftsmart.ie/" target="_blank" rel="noopener noreferrer">
                            <Gift className="w-4 h-4" /> Buy a Voucher
                        </a>
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={`md:hidden p-2 transition-colors ${isScrolled ? "text-foreground" : "text-primary-foreground"
                        }`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Open navigation menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {festive === "christmas" && (
                <ChristmasLights className="absolute left-0 right-0 top-full -mt-1" />
            )}

            <BackToTop className={festive === "christmas" ? "mt-5 md:mt-6" : undefined} />

            {/* Mobile Menu Portal */}
            {mounted && createPortal(
                <>
                    {/* Mobile Menu Overlay */}
                    <div
                        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                            }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Mobile Sidebar */}
                    <div
                        className={`md:hidden fixed top-0 left-0 h-[100dvh] w-[280px] bg-cream z-[101] shadow-elevated transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                            }`}
                    >
                        <div className="flex flex-col h-full p-6">
                            <div className="flex justify-between items-center mb-8">
                                <a
                                    href="/"
                                    className="font-display font-bold text-2xl uppercase tracking-widest text-foreground"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Kin Dee
                                </a>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-foreground hover:text-primary transition-colors"
                                    aria-label="Close navigation menu"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <ul className="flex flex-col gap-6">
                                {navLinks.map((link) => (
                                    <li key={link.href}>
                                        <a
                                            href={link.href}
                                            className="block font-body text-lg uppercase tracking-wider text-foreground/80 hover:text-primary transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6">
                                <a
                                    href={specialMenuLabel ? to("#special-menu", "/menu#special-menu") : to("#menu", "/menu")}
                                    className="flex items-center gap-2 px-4 py-3 border border-primary rounded-lg text-primary font-body text-sm font-semibold uppercase tracking-wider hover:bg-primary hover:text-white transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Star className="w-4 h-4" /> {specialMenuLabel ? `View ${specialMenuLabel} Menu` : "View Special Menu"}
                                </a>
                            </div>

                            <div className="mt-auto pt-8 border-t border-border">
                                <Button variant="hero" size="lg" className="w-full" asChild>
                                    <a href={to("#reservations", "/contact#reservations")} onClick={() => setIsMobileMenuOpen(false)}>Book a Table</a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </header>
    );
};

export default Header;
