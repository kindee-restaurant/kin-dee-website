import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import dishCurry from "@/assets/menu-thai-classics.jpg";
import dishRolls from "@/assets/menu-starters.jpg";
import dishSoup from "@/assets/menu-thai-asian-fusion.webp";
import dishDessert from "@/assets/menu-deserts.webp";

type MenuCategory = "starters" | "mains" | "fusion" | "desserts";

const categoryImages = {
    starters: dishRolls,
    mains: dishCurry,
    fusion: dishSoup,
    desserts: dishDessert,
};

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState<string>("starters");
    const [categories, setCategories] = useState<{ id: string; slug: string; label: string; image_url?: string }[]>([]);
    const [menuData, setMenuData] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(true);

    const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.3 });
    const { ref: menuRef, isVisible: menuVisible } = useScrollAnimation({ threshold: 0.1 });

    useEffect(() => {
        const fetchMenu = async () => {
            const { supabase } = await import("@/integrations/supabase/client");

            // 1. Fetch Categories
            const { data: catData } = await supabase.from("categories").select("*").order("display_order");
            if (!catData || catData.length === 0) return;

            setCategories(catData.map(c => ({ id: c.id, slug: c.slug, label: c.label, image_url: c.image_url })));
            setActiveCategory(catData[0].slug);

            // 2. Fetch Items
            const { data: itemData } = await supabase.from("menu_items").select("*").order("display_order");

            // 3. Group Items by Category Slug
            const groupedData: Record<string, any[]> = {};
            catData.forEach(cat => {
                groupedData[cat.slug] = itemData?.filter(item => item.category_id === cat.id) || [];
            });

            setMenuData(groupedData);
            setLoading(false);
        };

        fetchMenu();
    }, []);

    if (loading) return null; // Or a loading spinner

    return (
        <section id="menu" className="section-padding bg-background overflow-hidden">
            <div className="container-custom">
                {/* Header */}
                <div
                    className="text-center mb-12"
                >
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
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category.slug}
                            onClick={() => setActiveCategory(category.slug)}
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
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Image */}
                    <div className="hidden lg:block sticky top-32">
                        <div className="aspect-square rounded-lg overflow-hidden shadow-elevated">
                            <img
                                src={
                                    // 1. Check if the active category object has a DB image
                                    categories.find(c => c.slug === activeCategory)?.image_url ||
                                    // 2. Fallback to hardcoded map
                                    categoryImages[activeCategory as keyof typeof categoryImages] ||
                                    // 3. Fallback to default
                                    dishRolls
                                }
                                alt={`${activeCategory} at Kin Dee Thai restaurant`}
                                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-6">
                        {menuData[activeCategory]?.length === 0 ? (
                            <p className="text-muted-foreground text-center py-10">No items available in this category yet.</p>
                        ) : (
                            menuData[activeCategory]?.map((item, index) => (
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
                            ))
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
