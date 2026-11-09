import About from "@/components/About";
import PageShell from "@/components/PageShell";
import { getSiteData } from "@/lib/siteData";
import { pageMetadata } from "@/lib/seo";

const DESCRIPTION =
    "Kin Dee means “eat well” in Thai. The story of our South East Asian restaurant on Leeson Street Upper, Dublin 4, cooking with Irish produce.";

export const metadata = pageMetadata({
    path: "/about",
    title: "About Us – Our Story",
    description: DESCRIPTION,
    keywords: ["Kin Dee", "Kin Dee meaning", "Thai restaurant Leeson Street", "South East Asian restaurant Dublin"],
});

export default async function AboutPage() {
    const data = await getSiteData();
    return (
        <PageShell data={data} path="/about" name="About" description={DESCRIPTION} pageType="AboutPage">
            <About settings={data.settings} headingAs="h1" />
        </PageShell>
    );
}
