import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import SpecialMenuSection from "@/components/SpecialMenuSection";
import WineList from "@/components/WineList";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Reservations from "@/components/Reservations";
import Catering from "@/components/Catering";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Snowfall from "@/components/festive/Snowfall";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteData } from "@/lib/siteData";
import { groupWines, restaurantJsonLd, webPageJsonLd, websiteJsonLd, DEFAULT_DESCRIPTION } from "@/lib/seo";
import { getActiveTheme, getSpecialMenuTypeConfig } from "@/lib/specialMenus";

export const metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
    const data = await getSiteData();
    const theme = getActiveTheme(data.specialMenus);
    const specialLabel = data.specialMenus.length
        ? getSpecialMenuTypeConfig(data.specialMenus[0].type)?.label ?? "Special"
        : null;

    return (
        <main className={`min-h-screen ${theme ? `theme-${theme}` : ""}`}>
            <JsonLd
                data={[
                    restaurantJsonLd(data),
                    websiteJsonLd(),
                    webPageJsonLd({ path: "/", name: "Kin Dee | South East Asian Restaurant, Leeson Street, Dublin 4", description: DEFAULT_DESCRIPTION }),
                ]}
            />

            {theme === "christmas" && <Snowfall />}

            <Header festive={theme} specialMenuLabel={specialLabel} />
            <Hero
                data={data.hero}
                festiveBadge={theme ? getSpecialMenuTypeConfig(theme)?.heroBadge : undefined}
            />
            <SpecialMenuSection menus={data.specialMenus} />
            <Menu menus={data.menus} />
            <WineList groups={groupWines(data)} />
            <About settings={data.settings} />
            <Gallery images={data.galleryImages} />
            <Reservations settings={data.settings} hours={data.hours} />
            <Catering settings={data.settings} />
            <Contact settings={data.settings} hours={data.hours} />
            <Footer settings={data.settings} hours={data.hours} />
        </main>
    );
}
