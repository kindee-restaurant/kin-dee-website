"use client";

import { Fragment, useState } from "react";
import { FileText, Gift } from "lucide-react";
import { MenuLightbox, MenuPreviewCard } from "@/components/festive/MenuPreview";
import { getSpecialMenuTypeConfig, type SpecialMenu } from "@/lib/specialMenus";

interface SpecialMenuSectionProps {
    menus: SpecialMenu[];
}

/** Pine sprig with red berries and gold leaves, echoing the printed Christmas menu's corners. */
const PineCorner = ({ className = "", flip = false }: { className?: string; flip?: boolean }) => (
    <svg
        aria-hidden="true"
        viewBox="0 0 200 160"
        className={className}
        style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
        <g stroke="#1f4a30" strokeWidth="1.6" strokeLinecap="round">
            {/* main branch */}
            <path d="M0 18 C50 30 95 55 150 110" fill="none" stroke="#5a3d22" strokeWidth="2.4" />
            {Array.from({ length: 18 }, (_, i) => {
                const t = i / 17;
                const x = t * 150;
                const y = 18 + t * t * 92 + t * 10;
                return (
                    <g key={i}>
                        <line x1={x} y1={y} x2={x - 10} y2={y + 16} stroke={i % 2 ? "#2f6a44" : "#1f4a30"} />
                        <line x1={x} y1={y} x2={x + 6} y2={y + 18} stroke={i % 2 ? "#1f4a30" : "#2f6a44"} />
                        <line x1={x} y1={y} x2={x + 14} y2={y - 6} stroke="#2f6a44" />
                        <line x1={x} y1={y} x2={x - 4} y2={y - 14} stroke="#1f4a30" />
                    </g>
                );
            })}
        </g>
        {/* gold leaves */}
        <path d="M40 30 C55 10 75 12 82 6 C78 22 62 34 40 30Z" fill="#cfa443" />
        <path d="M95 68 C115 58 128 66 140 62 C130 78 112 80 95 68Z" fill="#d9b55a" />
        <path d="M18 40 C24 58 18 70 22 84 C8 72 6 54 18 40Z" fill="#c39433" />
        {/* berries */}
        {[
            [60, 44], [68, 50], [58, 54], [104, 84], [112, 78], [110, 90], [28, 30], [34, 38], [140, 112], [132, 118],
        ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 5.5 : 4.5} fill={i % 2 ? "#b3202a" : "#c8282f"} stroke="#7a1218" strokeWidth="0.6" />
        ))}
        {[[60, 44], [104, 84], [28, 30]].map(([cx, cy], i) => (
            <circle key={`h${i}`} cx={cx - 1.6} cy={cy - 1.6} r="1.4" fill="#fff" opacity="0.7" />
        ))}
    </svg>
);

const Sparkle = ({ className = "", delay = 0 }: { className?: string; delay?: number }) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`festive-sparkle ${className}`} style={{ animationDelay: `${delay}s` }}>
        <path d="M12 0 L13.6 10.4 L24 12 L13.6 13.6 L12 24 L10.4 13.6 L0 12 L10.4 10.4Z" fill="#d4a83a" />
    </svg>
);

const GoldDivider = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
        <span className="h-px w-10 sm:w-20 bg-gradient-to-r from-transparent to-[#c9a14a]" />
        <span className="text-[#c9a14a] text-xs">✦</span>
        {children}
        <span className="text-[#c9a14a] text-xs">✦</span>
        <span className="h-px w-10 sm:w-20 bg-gradient-to-l from-transparent to-[#c9a14a]" />
    </div>
);

const MenuFeature = ({ menu }: { menu: SpecialMenu }) => {
    const [open, setOpen] = useState(false);
    const hasImage = !!menu.image_url;

    const viewButtonClass =
        "inline-flex items-center justify-center gap-1.5 h-10 sm:h-11 px-4 sm:px-6 rounded-md bg-[#1d4a33] text-[#f8f1e3] font-body text-[11px] sm:text-sm font-semibold uppercase tracking-[0.1em] shadow-sm hover:bg-[#163a28] transition-colors";

    return (
        <div className={`grid gap-6 md:gap-10 items-center ${hasImage ? "md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]" : ""}`}>
            {hasImage ? (
                <MenuPreviewCard menu={menu} onOpen={() => setOpen(true)} />
            ) : null}

            <div className={`text-center ${hasImage ? "md:text-left" : ""}`}>
                <h3 className="font-festive text-lg sm:text-2xl text-[#1d4a33] tracking-wide">{menu.title}</h3>
                {menu.price_text && (
                    <p className="font-display italic text-lg text-[#a67c2a] mt-1">{menu.price_text}</p>
                )}
                {menu.description && (
                    <p className="text-sm sm:text-[15px] text-[#4a3d2a] mt-2 sm:mt-3 leading-relaxed whitespace-pre-line max-w-prose mx-auto md:mx-0">
                        {menu.description}
                    </p>
                )}
                <div className={`mt-5 sm:mt-6 flex flex-row gap-2 sm:gap-3 justify-center ${hasImage ? "md:justify-start" : ""} sm:justify-center`}>
                    {hasImage ? (
                        <button type="button" onClick={() => setOpen(true)} className={viewButtonClass}>
                            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> View Menu
                        </button>
                    ) : menu.pdf_url ? (
                        <a href={menu.pdf_url} target="_blank" rel="noopener noreferrer" className={viewButtonClass}>
                            <FileText className="w-4 h-4" /> View Full Menu
                        </a>
                    ) : null}
                    <a
                        href="#reservations"
                        className="inline-flex items-center justify-center h-10 sm:h-11 px-4 sm:px-6 rounded-md border border-[#c9a14a] text-[#1d4a33] font-body text-[11px] sm:text-sm font-semibold uppercase tracking-[0.1em] hover:bg-[#c9a14a]/15 transition-colors"
                    >
                        Book Your Table
                    </a>
                </div>
            </div>

            {hasImage && <MenuLightbox menu={menu} open={open} onOpenChange={setOpen} />}
        </div>
    );
};

const SpecialMenuSection = ({ menus }: SpecialMenuSectionProps) => {
    const active = menus.filter((m) => m.is_active);
    if (active.length === 0) return null;

    const cfg = getSpecialMenuTypeConfig(active[0].type);
    const heading = cfg?.sectionHeading ?? "Special";
    const tagline = cfg && "tagline" in cfg ? cfg.tagline : null;
    const footerWords: readonly string[] = cfg && "footerWords" in cfg ? cfg.footerWords : [];

    return (
        <section id="special-menu" className="festive-parchment relative overflow-hidden py-10 sm:py-14 md:py-16 scroll-mt-16">
            {/* corner garlands */}
            <PineCorner className="absolute -top-2 -left-4 w-16 sm:w-32 md:w-40 pointer-events-none opacity-90" />
            <PineCorner flip className="absolute -top-2 -right-4 w-16 sm:w-32 md:w-40 pointer-events-none opacity-90" />
                        
            <Sparkle className="hidden sm:block absolute top-24 left-[12%] w-4 h-4" />
            <Sparkle className="hidden sm:block absolute top-40 right-[10%] w-5 h-5" delay={1.1} />
                        <Sparkle className="hidden sm:block absolute bottom-32 right-[14%] w-3 h-3" delay={2} />

            <div className="relative mx-4 sm:mx-8 md:mx-auto max-w-4xl festive-frame rounded-sm px-4 py-7 sm:px-8 sm:py-10 md:px-12 bg-[#fbf6ea]/70">
                <header className="text-center mb-6 sm:mb-9">
                    <p className="font-festive text-[10px] sm:text-sm tracking-[0.35em] festive-gold-text font-semibold">KIN DEE</p>
                    <h2 className="font-festive font-semibold text-[1.75rem] leading-none sm:text-5xl md:text-[3.4rem] text-[#1d4a33] tracking-[0.04em] mt-2 sm:mt-3">
                        {heading.toUpperCase()}
                    </h2>
                    <div className="mt-4">
                        <GoldDivider>
                            <span className="font-festive text-xs sm:text-base tracking-[0.3em] text-[#5b4a2e]">MENU</span>
                        </GoldDivider>
                    </div>
                    {tagline && (
                        <p className="hidden sm:block mt-3 font-festive text-xs tracking-[0.28em] uppercase text-[#4a3d2a]">
                            {tagline}
                        </p>
                    )}
                </header>

                {active.length === 0 ? (
                    <Gift className="mx-auto w-16 h-16 text-[#c9a14a]" />
                ) : (
                    <div className="space-y-12 sm:space-y-16">
                        {active.map((menu) => (
                            <MenuFeature key={menu.id} menu={menu} />
                        ))}
                    </div>
                )}

                {footerWords.length > 0 && (
                    <p className="hidden sm:block mt-9 text-center font-festive text-[11px] tracking-[0.35em] uppercase text-[#7a6440]">
                        {footerWords.map((w, i) => (
                            <Fragment key={w}>
                                {i > 0 && <span className="text-[#c9a14a] mx-2 sm:mx-3">✦</span>}
                                {w}
                            </Fragment>
                        ))}
                    </p>
                )}
            </div>
        </section>
    );
};

export default SpecialMenuSection;
