import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import Snowfall from "@/components/festive/Snowfall";
import { getActiveTheme, getSpecialMenuTypeConfig } from "@/lib/specialMenus";
import type { SiteData } from "@/lib/siteData";

interface PageShellProps {
    data: SiteData;
    path: string;
    /** Breadcrumb label for this page. */
    name: string;
    /** Used for the WebPage schema. */
    description: string;
    /** Optional page h1 shown above the intro (use when the first section on the page isn't the h1). */
    heading?: string;
    /** Short intro shown under the breadcrumb, written for people and search engines. */
    intro?: React.ReactNode;
    schema?: (object | null)[];
    pageType?: string;
    children: React.ReactNode;
}

/** Layout for the dedicated pages (/menu, /gallery, …): solid header, visible breadcrumb, intro, footer and page schema. */
export default function PageShell({ data, path, name, description, heading, intro, schema = [], pageType, children }: PageShellProps) {
    const special = data.specialMenus[0];
    const specialLabel = special ? getSpecialMenuTypeConfig(special.type)?.label ?? "Special" : null;
    const theme = getActiveTheme(data.specialMenus);

    return (
        <main className={`min-h-screen ${theme ? `theme-${theme}` : ""}`}>
            <JsonLd data={[webPageJsonLd({ path, name: `${name} | Kin Dee Dublin`, description, type: pageType }), breadcrumbJsonLd([{ name, path }]), ...schema]} />
            {theme === "christmas" && <Snowfall />}
            <Header variant="page" festive={theme} specialMenuLabel={specialLabel} />

            <div className="pt-24 md:pt-28 bg-background">
                <div className="container-custom">
                    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
                        <ol className="flex items-center gap-2">
                            <li>
                                <a href="/" className="hover:text-primary">
                                    Home
                                </a>
                            </li>
                            <li aria-hidden="true">/</li>
                            <li aria-current="page" className="text-foreground">
                                {name}
                            </li>
                        </ol>
                    </nav>
                    {heading && <h1 className="heading-section text-foreground mt-4">{heading}</h1>}
                    {intro && <div className="mt-3 max-w-3xl text-muted-foreground leading-relaxed">{intro}</div>}
                </div>
            </div>

            {children}

            <Footer settings={data.settings} hours={data.hours} />
        </main>
    );
}
