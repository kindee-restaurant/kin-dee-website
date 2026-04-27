"use client";

import { Wine, ExternalLink } from "lucide-react";

interface Menu {
    id: string;
    title: string;
    slug: string;
    description?: string;
    image_url?: string;
    pdf_url?: string;
}

interface WineListProps {
    menus: Menu[];
}

const WineList = ({ menus }: WineListProps) => {
    const wineMenu = menus.find(m => m.slug === "wine");

    if (!wineMenu) return null;

    return (
        <section id="wines" className="section-padding bg-[#1a1a1a] text-[#f5f0e8]">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-[#C4A35A] mb-2">
                        Kin Dee
                    </p>
                    <h2 className="heading-section text-white mb-4">
                        Wine <em style={{ color: "#C4A35A" }}>List</em>
                    </h2>
                    <p className="text-body text-[#a89f91] max-w-2xl mx-auto">
                        A curated selection of fine wines to complement your dining experience.
                    </p>
                </div>

                <div className="max-w-md mx-auto">
                    <a
                        href={wineMenu.pdf_url || "#"}
                        target={wineMenu.pdf_url ? "_blank" : undefined}
                        rel={wineMenu.pdf_url ? "noopener noreferrer" : undefined}
                        className="group block relative overflow-hidden rounded-xl bg-[#252525] border border-[#333] hover:border-[#722F37] transition-all duration-500"
                    >
                        <div className="aspect-[4/3] relative overflow-hidden">
                            {wineMenu.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={wineMenu.image_url}
                                    alt={wineMenu.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-[#2a2522] flex items-center justify-center">
                                    <Wine className="w-20 h-20 text-[#C4A35A]/30" strokeWidth={1} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h3 className="font-display text-2xl text-white group-hover:text-[#C4A35A] transition-colors">
                                    {wineMenu.title}
                                </h3>
                                {wineMenu.description && (
                                    <p className="text-sm text-[#a89f91] mt-2">
                                        {wineMenu.description}
                                    </p>
                                )}
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="w-16 h-16 rounded-full bg-[#722F37] text-white flex items-center justify-center shadow-lg">
                                    <ExternalLink className="w-7 h-7" />
                                </div>
                            </div>
                        </div>
                    </a>
                </div>

                <p className="text-center text-xs text-[#555] mt-16">
                    All wines are subject to availability. Please ask your server for recommendations.
                </p>
            </div>
        </section>
    );
};

export default WineList;