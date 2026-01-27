"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Wine } from "lucide-react";

type WineCategory = { id: string; slug: string; label: string; description?: string };
type WineItem = { id: string; name: string; origin?: string; size?: string; price_glass?: string; price_bottle: string };

interface WineListProps {
    categories: WineCategory[];
    wineData: Record<string, WineItem[]>;
}

const WineList = ({ categories, wineData }: WineListProps) => {
    const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.slug || "sparkling");

    if (categories.length === 0) return null;

    const activeCategoryData = categories.find(c => c.slug === activeCategory);
    const items = wineData[activeCategory] || [];

    const scrollToContent = () => {
        const menuContainer = document.getElementById("wine-content");
        if (menuContainer) {
            const headerOffset = 150;
            const elementPosition = menuContainer.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            if (window.scrollY > offsetPosition) {
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        }
    };

    const renderWineItem = (item: WineItem) => (
        <div
            key={item.id}
            className="group p-6 bg-[#252525] rounded-lg border border-[#333] hover:border-[#722F37] transition-all duration-300"
        >
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <h3 className="font-display text-xl text-[#f5f0e8] group-hover:text-[#C4A35A] transition-colors">
                        {item.name}
                        {item.size && <span className="text-sm text-muted-foreground ml-2 font-sans font-normal opacity-70">({item.size})</span>}
                    </h3>
                    {item.origin && (
                        <p className="font-body text-sm text-[#a89f91] mt-1">
                            {item.origin}
                        </p>
                    )}
                </div>
                <div className="text-right font-display text-xl whitespace-nowrap">
                    {item.price_glass && (
                        <p className="text-sm text-[#a89f91] mb-1">
                            {item.price_glass}
                        </p>
                    )}
                    <p className="text-[#C4A35A] font-medium">
                        {item.price_bottle}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <section id="wines" className="section-padding bg-[#1a1a1a] text-[#f5f0e8]">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-[#C4A35A] mb-2">
                        Kin Dee
                    </p>
                    <h2 className="heading-section text-white mb-4">
                        Wine <em style={{ color: "#C4A35A" }}>List</em>
                    </h2>
                    <p className="text-body text-[#a89f91] max-w-2xl mx-auto">
                        A curated selection of fine wines to complement your dining experience.
                    </p>
                </div>

                {/* Category Tabs - Sticky on Mobile */}
                <div className="sticky top-16 z-40 bg-[#1a1a1a]/95 backdrop-blur-sm py-4 -mx-4 px-4 mb-8 lg:static lg:bg-transparent lg:p-0 lg:mb-16 flex flex-wrap justify-center gap-3 transition-all">
                    {categories.map((category) => (
                        <button
                            key={category.slug}
                            onClick={() => {
                                setActiveCategory(category.slug);
                                scrollToContent();
                            }}
                            className={cn(
                                "px-6 py-2.5 font-body text-xs uppercase tracking-wider rounded-full transition-all duration-300 border border-transparent",
                                activeCategory === category.slug
                                    ? "bg-[#722F37] text-white shadow-lg"
                                    : "bg-[#333] text-[#a89f91] hover:bg-[#444] hover:text-white"
                            )}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Split Layout Content */}
                <div id="wine-content" className="grid lg:grid-cols-3 gap-12 lg:gap-20 items-start scroll-mt-32">

                    {/* Left Column: Category Info - Sticky on Desktop */}
                    <div className="text-center lg:text-center animate-fade-in lg:sticky lg:top-32">
                        <div className="w-32 h-32 rounded-full bg-[#2a2522] flex items-center justify-center text-[#C4A35A] mx-auto mb-6 border border-[#C4A35A]/20">
                            <Wine className="w-12 h-12" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-display text-3xl text-white mb-4">
                            {activeCategoryData?.label}
                        </h3>
                        <p className="text-[#a89f91] max-w-sm mx-auto leading-relaxed">
                            {activeCategoryData?.description || "Celebrate with our selection of fine wines chosen to pair perfectly with spicy and aromatic Thai flavours."}
                        </p>
                    </div>

                    {/* Right Column: Wine Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-[#333] rounded-lg">
                                <p className="text-[#a89f91]">No wines available in this category yet.</p>
                            </div>
                        ) : (
                            items.map(renderWineItem)
                        )}
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-[#555] mt-16 max-w-xl mx-auto">
                    All wines are subject to availability. Please ask your server for recommendations.
                </p>
            </div>
        </section>
    );
};

export default WineList;
