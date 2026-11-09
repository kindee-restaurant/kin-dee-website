import Gallery from "@/components/Gallery";
import PageShell from "@/components/PageShell";
import { getSiteData } from "@/lib/siteData";
import { galleryJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
    const data = await getSiteData();
    const dishes = Array.from(
        new Set(data.galleryImages.map((g) => g.alt_text?.replace(/\s*\(\d+\)$/, "")).filter((d): d is string => !!d))
    ).slice(0, 6);
    return pageMetadata({
        path: "/gallery",
        title: "Gallery – Food & Restaurant Photos",
        description: `Photos of dishes and the dining room at Kin Dee, Leeson Street, Dublin 4${
            dishes.length ? `, including ${dishes.join(", ")}` : ""
        }.`,
        keywords: ["Kin Dee photos", "Thai food Dublin photos", ...dishes.map((d) => `${d} Dublin`)],
    });
}

export default async function GalleryPage() {
    const data = await getSiteData();
    return (
        <PageShell
            data={data}
            path="/gallery"
            name="Gallery"
            description="Photos of dishes and the dining room at Kin Dee, Dublin 4."
            pageType="CollectionPage"
            schema={[galleryJsonLd(data)]}
        >
            <Gallery images={data.galleryImages} headingAs="h1" />
        </PageShell>
    );
}
