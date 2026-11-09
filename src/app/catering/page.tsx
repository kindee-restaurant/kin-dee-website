import Catering from "@/components/Catering";
import PageShell from "@/components/PageShell";
import { getSiteData } from "@/lib/siteData";
import { pageMetadata } from "@/lib/seo";

const DESCRIPTION =
    "Thai and South East Asian catering in Dublin from Kin Dee: party pots, finger food and full-service menus for parties and corporate events.";

export const metadata = pageMetadata({
    path: "/catering",
    title: "Catering & Private Events in Dublin",
    description: DESCRIPTION,
    keywords: ["Thai catering Dublin", "Asian catering Dublin", "corporate catering Dublin 4", "party food Dublin"],
});

export default async function CateringPage() {
    const data = await getSiteData();
    return (
        <PageShell data={data} path="/catering" name="Catering" description={DESCRIPTION}>
            <Catering settings={data.settings} headingAs="h1" />
        </PageShell>
    );
}
