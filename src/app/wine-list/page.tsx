import WineList from "@/components/WineList";
import PageShell from "@/components/PageShell";
import { getSiteData } from "@/lib/siteData";
import { groupWines, pageMetadata, wineListJsonLd } from "@/lib/seo";

const DESCRIPTION =
    "The Kin Dee wine list: sparkling, white, rosé and red wines by the glass and bottle, chosen to pair with South East Asian food. Leeson Street, Dublin 4.";

export const metadata = pageMetadata({
    path: "/wine-list",
    title: "Wine List – By the Glass & Bottle",
    description: DESCRIPTION,
    keywords: ["Kin Dee wine list", "wine with Thai food", "restaurant wine list Dublin 4"],
});

export default async function WineListPage() {
    const data = await getSiteData();
    return (
        <PageShell data={data} path="/wine-list" name="Wine List" description={DESCRIPTION} schema={[wineListJsonLd(data)]}>
            <WineList groups={groupWines(data)} variant="full" headingAs="h1" />
        </PageShell>
    );
}
