import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "#about", label: "About" },
        { href: "#menu", label: "Menu" },
        { href: "#gallery", label: "Gallery" },
        { href: "#reservations", label: "Reservations" },
        { href: "#contact", label: "Contact" },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? "bg-background/95 backdrop-blur-md shadow-soft py-3"
                : "bg-foreground/20 backdrop-blur-sm py-5"
                }`}
        >
            <nav className="container-custom flex items-center justify-between">
                <a
                    href="#"
                    className={`font-script text-3xl md:text-4xl transition-colors duration-300 ${isScrolled ? "text-foreground" : "text-primary-foreground"
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
                    <Button variant="hero" size="lg" asChild>
                        <a href="#reservations">Book a Table</a>
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={`md:hidden p-2 transition-colors ${isScrolled ? "text-foreground" : "text-primary-foreground"
                        }`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu Portal */}
            {createPortal(
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
                                    href="#"
                                    className="font-script text-3xl text-foreground"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Kin Dee
                                </a>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-foreground hover:text-primary transition-colors"
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

                            <div className="mt-auto pt-8 border-t border-border">
                                <Button variant="hero" size="lg" className="w-full" asChild>
                                    <a href="#reservations" onClick={() => setIsMobileMenuOpen(false)}>Book a Table</a>
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
