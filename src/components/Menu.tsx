"use client";

import { FileText } from "lucide-react";

interface Menu {
    id: string;
    title: string;
    slug: string;
    description?: string;
    image_url?: string;
    pdf_url?: string;
    is_visible?: boolean;
}

interface MenuProps {
    menus: Menu[];
}

const Menu = ({ menus }: MenuProps) => {
    const visibleMenus = menus.filter(m => m.is_visible !== false);

    if (visibleMenus.length === 0) return null;

    return (
        <section id="menu" className="section-padding bg-background">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="heading-section text-foreground">
                        Our Menu
                    </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {visibleMenus.map((menu) => (
                        <a
                            key={menu.id}
                            href={menu.pdf_url || "#"}
                            target={menu.pdf_url ? "_blank" : undefined}
                            rel={menu.pdf_url ? "noopener noreferrer" : undefined}
                            className="group block bg-card border border-border hover:border-primary rounded-xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-primary/10"
                        >
                            <div className="p-6">
                                <h3 className="font-display text-2xl text-foreground group-hover:text-primary transition-colors">
                                    {menu.title}
                                </h3>
                                {menu.description && (
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                                        {menu.description}
                                    </p>
                                )}
                            </div>
                            {menu.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={menu.image_url}
                                    alt={menu.title}
                                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full aspect-[4/3] bg-secondary flex items-center justify-center">
                                    <FileText className="w-16 h-16 text-muted-foreground/30" />
                                </div>
                            )}
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