"use client";

import Image from "next/image";
import { FileText, Star } from "lucide-react";

interface Menu {
    id: string;
    title: string;
    slug: string;
    description?: string;
    image_url?: string;
    pdf_url?: string;
    is_visible?: boolean;
    is_special?: boolean;
}

interface MenuProps {
    /** Render the section title as the page's h1 (on its dedicated page) instead of h2. */
    headingAs?: "h1" | "h2";
    menus: Menu[];
}

const Menu = ({ menus, headingAs: HeadingTag = "h2" }: MenuProps) => {
    const visibleMenus = menus.filter(m => m.is_visible !== false);

    if (visibleMenus.length === 0) return null;

    return (
        <section id="menu" className="section-padding bg-background">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <HeadingTag className="heading-section text-foreground">
                        Our Menu
                    </HeadingTag>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
                    {visibleMenus.map((menu) => (
                        <a
                            key={menu.id}
                            href={menu.pdf_url || "#"}
                            target={menu.pdf_url ? "_blank" : undefined}
                            rel={menu.pdf_url ? "noopener noreferrer" : undefined}
                            className={`group relative flex flex-col rounded-xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${
                                menu.is_special
                                    ? "border-2 border-primary bg-card shadow-primary/20 hover:shadow-primary/40 animate-[special-glow_4s_ease-in-out_infinite]"
                                    : "bg-card border border-border hover:border-primary shadow-primary/10"
                            }`}
                        >
                            <div className="relative aspect-[3/2] overflow-hidden bg-secondary">
                                {menu.image_url ? (
                                    <Image
                                        src={menu.image_url}
                                        alt={`${menu.title} at Kin Dee, Dublin`}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FileText className="w-14 h-14 text-muted-foreground/30" />
                                    </div>
                                )}
                                {menu.is_special && (
                                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1 shadow">
                                        <Star className="w-3 h-3 fill-current" /> SPECIAL
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <h3
                                    className={`font-display text-xl leading-snug whitespace-nowrap overflow-hidden text-ellipsis transition-colors ${
                                        menu.is_special ? "text-primary" : "text-foreground group-hover:text-primary"
                                    }`}
                                    title={menu.title}
                                >
                                    {menu.title}
                                </h3>
                                {menu.description && (
                                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2" title={menu.description}>
                                        {menu.description.replace(/\s+/g, " ")}
                                    </p>
                                )}
                                {menu.pdf_url && (
                                    <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                                        <FileText className="w-3.5 h-3.5" /> View menu
                                    </span>
                                )}
                            </div>
                        </a>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-secondary/50 rounded-xl border border-border">
                    <p className="text-lg font-medium text-foreground mb-4">
                        Please inform us of any allergies or dietary requirements.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-2 text-sm text-muted-foreground text-left">
                        <p><span className="font-medium text-foreground">1a.</span> Wheat</p>
                        <p><span className="font-medium text-foreground">1b.</span> Barley</p>
                        <p><span className="font-medium text-foreground">1c.</span> Oats</p>
                        <p><span className="font-medium text-foreground">1d.</span> Rye</p>
                        <p><span className="font-medium text-foreground">2.</span> Crustaceans</p>
                        <p><span className="font-medium text-foreground">3.</span> Egg</p>
                        <p><span className="font-medium text-foreground">4.</span> Fish</p>
                        <p><span className="font-medium text-foreground">5.</span> Peanuts</p>
                        <p><span className="font-medium text-foreground">6.</span> Soybeans</p>
                        <p><span className="font-medium text-foreground">7.</span> Dairy/Milk</p>
                        <p><span className="font-medium text-foreground">8.</span> Nuts</p>
                        <p><span className="font-medium text-foreground">9.</span> Celery</p>
                        <p><span className="font-medium text-foreground">10.</span> Mustard</p>
                        <p><span className="font-medium text-foreground">11.</span> Sesame Seed</p>
                        <p><span className="font-medium text-foreground">12.</span> Sulphites/Sulphur Dioxide</p>
                        <p><span className="font-medium text-foreground">13.</span> Lupin</p>
                        <p><span className="font-medium text-foreground">14.</span> Molluscs</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Menu;