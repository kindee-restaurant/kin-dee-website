"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import dishCurry from "@/assets/menu-thai-classics.jpg";
import dishRolls from "@/assets/menu-starters.jpg";
import dishSoup from "@/assets/menu-thai-asian-fusion.webp";
import dishDessert from "@/assets/menu-deserts.webp";

type MenuCategory = { id: string; slug: string; label: string; image_url?: string };
type MenuItem = { id: string; name: string; description?: string; price: string; is_spicy?: boolean; is_available?: boolean };

const categoryImages: Record<string, any> = {
    starters: dishRolls,
    mains: dishCurry,
    fusion: dishSoup,
    desserts: dishDessert,
};

interface MenuProps {
    categories: MenuCategory[];
    menuData: Record<string, MenuItem[]>;
}

const Menu = ({ categories, menuData }: MenuProps) => {
    const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.slug || "starters");
    const { ref: menuRef, isVisible: menuVisible } = useScrollAnimation({ threshold: 0.1 });

    if (categories.length === 0) return null;

    const items = menuData[activeCategory] || [];
    const SPLIT_THRESHOLD = 5;
    const IMAGE_HEIGHT_EQUIVALENT = 4;
    const shouldSplit = items.length > SPLIT_THRESHOLD;

    const rightCount = shouldSplit ? Math.floor((items.length + IMAGE_HEIGHT_EQUIVALENT) / 2) : items.length;
    const rightColumnItems = items.slice(0, rightCount);
    const leftColumnItems = shouldSplit ? items.slice(rightCount) : [];

    const renderMenuItem = (item: MenuItem) => (
        <div
            key={item.id}
            className="group p-6 bg-card rounded-lg border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-500"
        >
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                        {item.is_spicy && <span className="ml-2 text-sm">🌶️</span>}
                        {!item.is_available && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Sold Out</span>}
                    </h3>
                    <p className="font-body text-muted-foreground mt-1">
                        {item.description}
                    </p>
                </div>
                <p className="font-display text-xl text-primary font-medium">
                    {item.price}
                </p>
            </div>
        </div>
    );

    return (
        <section id="menu" className="section-padding bg-background">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-4">
                        Our Menu
                    </p>
                    <h2 className="heading-section text-foreground mb-4">
                        A Taste of <em>Thailand & Beyond</em>
                    </h2>
                    <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                        From authentic Thai classics to innovative Asian fusion creations,
                        each dish is crafted with passion and the finest ingredients.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm py-4 -mx-4 px-4 mb-8 lg:static lg:bg-transparent lg:p-0 lg:mb-12 flex flex-wrap justify-center gap-2 transition-all">
                    {categories.map((category) => (
                        <button
                            key={category.slug}
                            onClick={() => {
                                setActiveCategory(category.slug);
                                const menuContainer = document.getElementById("menu-content");
                                if (menuContainer) {
                                    const headerOffset = 150;
                                    const elementPosition = menuContainer.getBoundingClientRect().top;
                                    const offsetPosition = elementPosition + window.scrollY - headerOffset;
                                    if (window.scrollY > offsetPosition) {
                                        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                                    }
                                }
                            }}
                            className={cn(
                                "px-6 py-3 font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300",
                                activeCategory === category.slug
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                            )}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Menu Content */}
                <div id="menu-content" className="grid lg:grid-cols-2 gap-12 items-start scroll-mt-32">
                    {/* Left Column: Image + Overflow Items (desktop only) */}
                    <div className="hidden lg:block space-y-6">
                        <div className="aspect-square rounded-lg overflow-hidden shadow-elevated relative">
                            <Image
                                src={
                                    categories.find(c => c.slug === activeCategory)?.image_url ||
                                    categoryImages[activeCategory] ||
                                    dishRolls
                                }
                                alt={`${activeCategory} at Kin Dee Thai restaurant`}
                                fill
                                className="object-cover transition-all duration-700 hover:scale-105"
                            />
                        </div>
                        {leftColumnItems.map(renderMenuItem)}
                    </div>

                    {/* Right Column: Primary Items */}
                    <div className="space-y-6">
                        {items.length === 0 ? (
                            <p className="text-muted-foreground text-center py-10">No items available in this category yet.</p>
                        ) : (
                            <>
                                <div className="lg:hidden space-y-6">
                                    {items.map(renderMenuItem)}
                                </div>
                                <div className="hidden lg:block space-y-6">
                                    {rightColumnItems.map(renderMenuItem)}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Note */}
                <p className="text-center text-sm text-muted-foreground mt-12">
                    🌶️ Indicates spicy dishes. Please inform us of any allergies or dietary requirements.
                </p>
            </div>
        </section>
    );
};

export default Menu;
