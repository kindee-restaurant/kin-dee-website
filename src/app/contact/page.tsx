import Contact from "@/components/Contact";
import Reservations from "@/components/Reservations";
import FAQ from "@/components/FAQ";
import PageShell from "@/components/PageShell";
import { getSiteData } from "@/lib/siteData";
import { ADDRESS_LINE, buildFaqs, faqJsonLd, pageMetadata, restaurantJsonLd } from "@/lib/seo";

export async function generateMetadata() {
    const data = await getSiteData();
    const hours = data.hours.map((h) => `${h.day_range} ${h.hours}`).join(", ");
    return pageMetadata({
        path: "/contact",
        title: "Contact, Opening Hours & Reservations",
        description: `Kin Dee, 133 Leeson Street Upper, Dublin 4.${hours ? ` Open ${hours}.` : ""} Book a table online or call us.`,
        keywords: [
            "Kin Dee opening hours",
            "Kin Dee reservations",
            "Kin Dee address",
            "restaurant Leeson Street Upper",
            "book a table Dublin 4",
        ],
    });
}

export default async function ContactPage() {
    const data = await getSiteData();
    const faqs = buildFaqs(data);
    return (
        <PageShell
            data={data}
            path="/contact"
            name="Contact & Reservations"
            description={`Address, opening hours, phone and online booking for Kin Dee, ${ADDRESS_LINE}.`}
            pageType="ContactPage"
            schema={[restaurantJsonLd(data), faqJsonLd(faqs)]}
        >
            <Contact settings={data.settings} hours={data.hours} headingAs="h1" />
            <Reservations settings={data.settings} hours={data.hours} />
            <FAQ faqs={faqs} />
        </PageShell>
    );
}
