import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Wine } from "lucide-react";

const WineList = () => {
    const [activeCategory, setActiveCategory] = useState<string>("sparkling");
    const [categories, setCategories] = useState<{ id: string; slug: string; label: string }[]>([]);
    const [wineData, setWineData] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWines = async () => {
            const { supabase } = await import("@/integrations/supabase/client");

            // 1. Fetch Categories
            const { data: catData } = await supabase.from("wine_categories").select("*").order("display_order");
            if (!catData || catData.length === 0) {
                setLoading(false);
                return;
            }

            setCategories(catData.map(c => ({ id: c.id, slug: c.slug, label: c.label })));
            setActiveCategory(catData[0].slug);

            // 2. Fetch Items
            const { data: itemData } = await supabase.from("wine_items").select("*").order("display_order");

            // 3. Group Items by Category Slug
            const groupedData: Record<string, any[]> = {};
            catData.forEach(cat => {
                groupedData[cat.slug] = itemData?.filter(item => item.category_id === cat.id) || [];
            });

            setWineData(groupedData);
            setLoading(false);
        };

        fetchWines();
    }, []);

    if (loading) return null;

    const items = wineData[activeCategory] || [];

    return (
        <section id="wines" className="section-padding bg-[#1a1a1a] text-white">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="font-body text-sm uppercase tracking-[0.2em] text-[#C4A35A] mb-4">
                        Kin Dee
                    </p>
                    <h2 className="heading-section text-white mb-4">
                        Wine <em className="text-[#C4A35A]">List</em>
                    </h2>
                    <p className="text-body text-white/70 max-w-2xl mx-auto">
                        A curated selection of fine wines to complement your dining experience.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="sticky top-16 z-40 bg-[#1a1a1a]/95 backdrop-blur-sm py-4 -mx-4 px-4 mb-8 lg:static lg:bg-transparent lg:p-0 lg:mb-12 flex flex-wrap justify-center gap-2 transition-all">
                    {categories.map((category) => (
                        <button
                            key={category.slug}
                            onClick={() => {
                                setActiveCategory(category.slug);
                                // Scroll logic for mobile
                                const wineContainer = document.getElementById("wine-content");
                                if (wineContainer) {
                                    const headerOffset = 150;
                                    const elementPosition = wineContainer.getBoundingClientRect().top;
                                    const offsetPosition = elementPosition + window.scrollY - headerOffset;
                                    if (window.scrollY > offsetPosition) {
                                        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                                    }
                                }
                            }}
                            className={cn(
                                "px-6 py-3 font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300",
                                activeCategory === category.slug
                                    ? "bg-[#722F37] text-white"
                                    : "bg-white/10 text-white/80 hover:bg-[#722F37]/30"
                            )}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Wine Content */}
                <div id="wine-content" className="grid lg:grid-cols-2 gap-8 items-start scroll-mt-32">
                    {/* Left Column: Decorative */}
                    <div className="hidden lg:flex flex-col items-center justify-center p-8">
                        <div className="w-32 h-32 rounded-full bg-[#722F37]/20 flex items-center justify-center mb-6">
                            <Wine className="w-16 h-16 text-[#C4A35A]" />
                        </div>
                        <h3 className="font-display text-3xl text-white text-center mb-4">
                            {categories.find(c => c.slug === activeCategory)?.label}
                        </h3>
                        <p className="text-white/60 text-center max-w-sm">
                            {activeCategory === "sparkling" && "Celebrate with our selection of sparkling wines and Prosecco."}
                            {activeCategory === "white" && "Crisp and refreshing whites from around the world."}
                            {activeCategory === "rose" && "Light and elegant rosé for any occasion."}
                            {activeCategory === "red" && "Bold and expressive reds to complement your meal."}
                        </p>
                    </div>

                    {/* Right Column: Wine Items */}
                    <div className="space-y-4">
                        {items.length === 0 ? (
                            <p className="text-white/60 text-center py-10">No wines available in this category yet.</p>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.id}
                                    className="group p-5 bg-white/5 rounded-lg border border-white/10 hover:border-[#C4A35A]/50 hover:bg-white/10 transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-display text-lg text-white group-hover:text-[#C4A35A] transition-colors">
                                                {item.name}
                                                {item.size && <span className="ml-2 text-sm text-white/50">({item.size})</span>}
                                            </h4>
                                            {item.origin && (
                                                <p className="font-body text-sm text-white/60 mt-1">
                                                    {item.origin}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            {item.price_glass && (
                                                <p className="text-sm text-white/70">
                                                    <span className="text-[#C4A35A]">{item.price_glass}</span> / glass
                                                </p>
                                            )}
                                            <p className="font-display text-lg text-[#C4A35A]">
                                                {item.price_bottle}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Note */}
                <p className="text-center text-sm text-white/50 mt-12">
                    All wines are subject to availability. Please ask your server for recommendations.
                </p>
            </div>
        </section>
    );
};

export default WineList;
