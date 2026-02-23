"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ChevronDown } from "lucide-react";
import dishCurry from "@/assets/menu-thai-classics.jpg";
import dishRolls from "@/assets/menu-starters.jpg";
import dishSoup from "@/assets/menu-thai-asian-fusion.webp";
import dishDessert from "@/assets/menu-deserts.webp";

type MenuCategory = { id: string; slug: string; label: string; image_url?: string };
type MenuItem = { id: string; name: string; description?: string; price: string; is_spicy?: boolean; is_available?: boolean; menu_type?: string };
type Allergen = { id: string; number: string; name: string; display_order: number };

const categoryImages: Record<string, any> = {
    starters: dishRolls,
    mains: dishCurry,
    fusion: dishSoup,
    desserts: dishDessert,
};

interface MenuProps {
    categories: MenuCategory[];
    menuData: Record<string, MenuItem[]>;
    allergens: Allergen[];
    allergenMap: Record<string, string[]>; // menu_item_id -> allergen number labels
}

const Menu = ({ categories, menuData, allergens, allergenMap }: MenuProps) => {
    const [activeMenuType, setActiveMenuType] = useState<"lunch" | "dinner">("dinner");
    const [activeCategory, setActiveCategory] = useState<string>("starters");
    const [allergensOpen, setAllergensOpen] = useState(false);
    const { ref: menuRef, isVisible: menuVisible } = useScrollAnimation({ threshold: 0.1 });

    if (categories.length === 0) return null;

    // Filter items based on activeMenuType (defaulting items without menu_type to 'dinner')
    const filteredItems = (menuData[activeCategory] || []).filter(
        (item) => (item.menu_type || "dinner") === activeMenuType
    );
    const SPLIT_THRESHOLD = 5;
    const IMAGE_HEIGHT_EQUIVALENT = 4;
    const shouldSplit = filteredItems.length > SPLIT_THRESHOLD;

    const rightCount = shouldSplit ? Math.floor((filteredItems.length + IMAGE_HEIGHT_EQUIVALENT) / 2) : filteredItems.length;
    const rightColumnItems = filteredItems.slice(0, rightCount);
    const leftColumnItems = shouldSplit ? filteredItems.slice(rightCount) : [];

    const renderMenuItem = (item: MenuItem) => {
        const itemAllergens = allergenMap[item.id] || [];
        return (
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
                            {itemAllergens.length > 0 && (
                                <span className="text-primary/70 font-medium"> ({itemAllergens.join(", ")})</span>
                            )}
                        </p>
                    </div>
                    <p className="font-display text-xl text-primary font-medium">
                        {item.price}
                    </p>
                </div>
            </div>
        )
    };

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
                        From authentic Thai, Vietnamese and Malay classics to more innovative creations,
                        each dish is crafted with passion and the finest ingredients, ensuring you "Eat Well".
                    </p>
                </div>

                {/* Lunch / Dinner Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-secondary p-1 rounded-full inline-flex">
                        <button
                            onClick={() => {
                                setActiveMenuType("lunch");
                                setActiveCategory("starters");
                            }}
                            className={cn(
                                "px-8 py-2.5 rounded-full font-body text-sm uppercase tracking-wider transition-all duration-300",
                                activeMenuType === "lunch" ? "bg-primary text-primary-foreground shadow-sm" : "hover:text-primary"
                            )}
                        >
                            Lunch
                        </button>
                        <button
                            onClick={() => {
                                setActiveMenuType("dinner");
                                setActiveCategory("starters");
                            }}
                            className={cn(
                                "px-8 py-2.5 rounded-full font-body text-sm uppercase tracking-wider transition-all duration-300",
                                activeMenuType === "dinner" ? "bg-primary text-primary-foreground shadow-sm" : "hover:text-primary"
                            )}
                        >
                            Dinner
                        </button>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm py-4 -mx-4 px-4 mb-4 lg:static lg:bg-transparent lg:p-0 lg:mb-8 flex flex-wrap justify-center gap-2 transition-all">
                    {categories
                        // Only show categories that have items for the currently active menu_type
                        .filter(
                            (category) =>
                                (menuData[category.slug] || []).filter(
                                    (item) => (item.menu_type || "dinner") === activeMenuType
                                ).length > 0
                        )
                        .map((category) => (
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
                                    "px-6 py-2.5 font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300",
                                    activeCategory === category.slug
                                        ? "bg-foreground text-background"
                                        : "bg-surface text-muted-foreground border border-border hover:border-primary/50"
                                )}
                            >
                                {category.label}
                            </button>
                        ))}
                </div>

                {/* Dynamic Category Subtitle */}
                {activeMenuType === "lunch" && activeCategory === "starters" && (
                    <p className="text-center font-body text-primary/80 mb-8 italic">
                        All €9.00 or 3 for €24.00
                    </p>
                )}
                {activeMenuType === "lunch" && activeCategory === "mains" && (
                    <p className="text-center font-body text-primary/80 mb-8 italic">
                        All €18.00 (rice free with all dishes beside noodles)
                    </p>
                )}

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
                        {filteredItems.length === 0 ? (
                            <p className="text-muted-foreground text-center py-10">No items available in this category yet.</p>
                        ) : (
                            <>
                                <div className="lg:hidden space-y-6">
                                    {filteredItems.map(renderMenuItem)}
                                </div>
                                <div className="hidden lg:block space-y-6">
                                    {rightColumnItems.map(renderMenuItem)}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Allergen Note & Legend */}
                <div className="mt-12 space-y-4">
                    <p className="text-center text-sm text-muted-foreground">
                        🌶️ Indicates spicy dishes. Please inform us of any allergies or dietary requirements.
                    </p>

                    {allergens.length > 0 && (
                        <div className="max-w-2xl mx-auto">
                            <button
                                onClick={() => setAllergensOpen(!allergensOpen)}
                                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-secondary text-secondary-foreground hover:bg-primary/10 transition-all duration-300 font-body text-sm uppercase tracking-wider"
                            >
                                Allergen Information
                                <ChevronDown className={cn(
                                    "w-4 h-4 transition-transform duration-300",
                                    allergensOpen && "rotate-180"
                                )} />
                            </button>
                            <div className={cn(
                                "overflow-hidden transition-all duration-500 ease-in-out",
                                allergensOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
                            )}>
                                <div className="bg-card border border-border rounded-lg p-6">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                                        {allergens.map(a => (
                                            <p key={a.id} className="font-body text-sm text-muted-foreground">
                                                <span className="font-medium text-foreground">{a.number}.</span> {a.name}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Menu;
