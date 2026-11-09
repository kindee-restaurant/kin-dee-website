import Menu from "@/components/Menu";
import SpecialMenuSection from "@/components/SpecialMenuSection";
import PageShell from "@/components/PageShell";
import { getSiteData } from "@/lib/siteData";
import { pageMetadata, restaurantJsonLd } from "@/lib/seo";

const DESCRIPTION =
    "Lunch, dinner, early-evening Neighbourhood and takeaway menus at Kin Dee, Leeson Street, Dublin 4. Thai and South East Asian dishes; vegan options.";

export const metadata = pageMetadata({
    path: "/menu",
    title: "Menus – Lunch, Dinner & Takeaway",
    description: DESCRIPTION,
    keywords: [
        "Kin Dee menu",
        "Thai restaurant menu Dublin",
        "South East Asian food Dublin 4",
        "Leeson Street restaurant menu",
        "Thai takeaway Dublin 4",
    ],
});

export default async function MenuPage() {
    const data = await getSiteData();
    return (
        <PageShell
            data={data}
            path="/menu"
            name="Menus"
            heading="Our Menus"
            description={DESCRIPTION}
            schema={[restaurantJsonLd(data)]}
            intro={
                <p>
                    Thai classics and modern South East Asian dishes made with Irish produce. Every dish is labelled with
                    the 14 EU allergens; vegan and vegetarian options available.
                </p>
            }
        >
            <SpecialMenuSection menus={data.specialMenus} />
            <Menu menus={data.menus} />
        </PageShell>
    );
}
