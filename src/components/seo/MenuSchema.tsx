"use client";

interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: string;
}

interface MenuCategory {
    id: string;
    name: string;
    slug: string;
}

interface MenuSchemaProps {
    categories: MenuCategory[];
    menuData: Record<string, MenuItem[]>;
    restaurantName?: string;
}

/**
 * Generates JSON-LD Menu schema for rich search results
 * @see https://schema.org/Menu
 */
export function MenuSchema({
    categories,
    menuData,
    restaurantName = "Kin Dee",
}: MenuSchemaProps) {
    const menuSections = categories.map((category) => ({
        "@type": "MenuSection",
        name: category.name,
        hasMenuItem: (menuData[category.slug] || []).map((item) => ({
            "@type": "MenuItem",
            name: item.name,
            description: item.description || undefined,
            offers: {
                "@type": "Offer",
                price: item.price.replace(/[^0-9.]/g, ""),
                priceCurrency: "EUR",
            },
        })),
    }));

    const schema = {
        "@context": "https://schema.org",
        "@type": "Menu",
        name: `${restaurantName} Menu`,
        hasMenuSection: menuSections,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
