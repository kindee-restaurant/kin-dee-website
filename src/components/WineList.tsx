import { Wine, ArrowRight } from "lucide-react";
import type { WineCategory, WineItem } from "@/lib/siteData";

interface WineGroup extends WineCategory {
    items: WineItem[];
}

interface WineListProps {
    /** Render the section title as the page's h1 (on its dedicated page) instead of h2. */
    headingAs?: "h1" | "h2";
    groups: WineGroup[];
    /** "preview" (homepage): a short taster linking to /wine-list. "full": every wine with prices. */
    variant?: "preview" | "full";
}

const clean = (p?: string | null) => (p ? p.replace(/€\s+/, "€") : "");

const COUNTRIES = ["France", "Italy", "Spain", "Portugal", "Germany", "Austria", "Greece", "New Zealand", "Australia", "Argentina", "Chile", "South Africa", "USA", "Lebanon"];

const WineList = ({ groups, variant = "preview", headingAs: HeadingTag = "h2" }: WineListProps) => {
    if (groups.length === 0) return null;
    const all = groups.flatMap((g) => g.items);
    const countries = COUNTRIES.filter((c) => all.some((w) => w.origin?.includes(c)));
    const countryText =
        countries.length > 1 ? `${countries.slice(0, -1).join(", ")} and ${countries[countries.length - 1]}` : countries[0];
    const byGlass = all.filter((w) => w.price_glass).length;

    return (
        <section id="wines" aria-labelledby="wines-heading" className="section-padding bg-[#1a1a1a] text-[#f5f0e8]">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-[#C4A35A] mb-2">Kin Dee</p>
                    <HeadingTag id="wines-heading" className="heading-section text-white mb-4">
                        Wine <em style={{ color: "#C4A35A" }}>List</em>
                    </HeadingTag>
                    <p className="text-body text-[#a89f91] max-w-2xl mx-auto">
                        {all.length} wines{countryText ? ` from ${countryText}` : ""}, chosen to pair with South East
                        Asian flavours{byGlass ? `, ${byGlass} of them available by the glass` : ""}.
                    </p>
                </div>

                {variant === "full" ? (
                    <div className="max-w-3xl mx-auto space-y-12">
                        {groups.map((g) => (
                            <div key={g.id} id={g.slug} className="scroll-mt-24">
                                <div className="flex items-end justify-between border-b border-[#C4A35A]/40 pb-2 mb-4">
                                    <h2 className="font-display text-2xl text-white">{g.label}</h2>
                                    <div className="hidden sm:flex gap-6 text-xs uppercase tracking-wider text-[#a89f91]">
                                        <span className="w-16 text-right">Glass</span>
                                        <span className="w-16 text-right">Bottle</span>
                                    </div>
                                </div>
                                <ul className="space-y-3">
                                    {g.items.map((w) => (
                                        <li key={w.id} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
                                            <div className="flex-1">
                                                <span className="text-[#f5f0e8]">{w.name}</span>
                                                {(w.origin || w.size) && (
                                                    <span className="text-sm text-[#a89f91]">
                                                        {" · "}
                                                        {[w.origin, w.size].filter(Boolean).join(" · ")}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-6 text-sm tabular-nums text-[#e8dcc4]">
                                                <span className="sm:w-16 sm:text-right">
                                                    {w.price_glass ? (
                                                        <>
                                                            <span className="sm:hidden text-[#a89f91]">Glass </span>
                                                            {clean(w.price_glass)}
                                                        </>
                                                    ) : (
                                                        <span className="hidden sm:inline text-[#555]">–</span>
                                                    )}
                                                </span>
                                                <span className="sm:w-16 sm:text-right">
                                                    <span className="sm:hidden text-[#a89f91]">Bottle </span>
                                                    {clean(w.price_bottle)}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {groups.map((g) => (
                                <a
                                    key={g.id}
                                    href={`/wine-list#${g.slug}`}
                                    className="group rounded-xl bg-[#252525] border border-[#333] hover:border-[#722F37] p-5 transition-colors"
                                >
                                    <Wine className="w-6 h-6 text-[#C4A35A] mb-3" strokeWidth={1.5} />
                                    <h3 className="font-display text-xl text-white">{g.label}</h3>
                                    <p className="text-sm text-[#a89f91] mt-1 line-clamp-2">
                                        {g.items.length} {g.items.length === 1 ? "wine" : "wines"} · {g.items[0].name}
                                        {g.items.length > 1 ? "…" : ""}
                                    </p>
                                </a>
                            ))}
                        </div>
                        <div className="text-center mt-10">
                            <a
                                href="/wine-list"
                                className="inline-flex items-center gap-2 px-6 h-12 rounded-md border border-[#C4A35A] text-[#f5f0e8] hover:bg-[#C4A35A] hover:text-[#1a1a1a] transition-colors font-semibold text-sm uppercase tracking-wider"
                            >
                                See the full wine list <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                )}

                <p className="text-center text-xs text-[#9a9289] mt-16">
                    All wines are subject to availability. Please ask your server for recommendations.
                </p>
            </div>
        </section>
    );
};

export default WineList;
