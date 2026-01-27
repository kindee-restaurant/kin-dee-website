"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import heroFood from "@/assets/feast-for-the-eyes-4.jpg";
import restaurantInterior from "@/assets/feast-for-the-eyes-1.webp";
import dishCurry from "@/assets/feast-for-the-eyes-2.webp";
import dishRolls from "@/assets/feast-for-the-eyes-3.jpg";
import dishSoup from "@/assets/feast-for-the-eyes-5.jpg";
import dishDessert from "@/assets/feast-for-the-eyes-6.webp";
import { cn } from "@/lib/utils";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryImage = { id?: string; image_url: any; alt_text?: string };

const fallbackImages: GalleryImage[] = [
    { image_url: restaurantInterior, alt_text: "Elegant dining room at Kin Dee Dublin" },
    { image_url: dishCurry, alt_text: "Thai green curry dish" },
    { image_url: dishRolls, alt_text: "Fresh spring rolls appetizer" },
    { image_url: heroFood, alt_text: "Signature prawn noodles" },
    { image_url: dishSoup, alt_text: "Tom yum soup" },
    { image_url: dishDessert, alt_text: "Mango sticky rice dessert" },
];

interface GalleryProps {
    images?: GalleryImage[];
}

const Gallery = ({ images: propImages }: GalleryProps) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    const images = propImages && propImages.length > 0 ? propImages : fallbackImages;

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % images.length));
    }, [images.length]);

    const handlePrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length));
    }, [images.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === "Escape") setSelectedIndex(null);
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, handleNext, handlePrev]);

    return (
        <section id="gallery" className="section-padding bg-cream overflow-hidden">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-4">
                        Gallery
                    </p>
                    <h2 className="heading-section text-foreground mb-4">
                        A Feast for the <em>Eyes</em>
                    </h2>
                    <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                        Step inside Kin Dee and discover our elegant space and beautifully crafted dishes.
                    </p>
                </div>

                {/* Gallery Grid - Automatic Masonry Layout */}
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {images.map((image, index) => (
                        <div
                            key={image.id || index}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                "break-inside-avoid relative rounded-lg overflow-hidden group cursor-pointer transition-all duration-700 mb-4"
                            )}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="relative w-full h-auto min-h-[200px]">
                                <Image
                                    src={image.image_url}
                                    alt={image.alt_text || "Gallery image"}
                                    width={500}
                                    height={500}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300 pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Portal */}
            {mounted && selectedIndex !== null && createPortal(
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300"
                    onClick={() => setSelectedIndex(null)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setSelectedIndex(null)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 transition-colors z-50"
                    >
                        <X size={32} />
                    </button>

                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3 md:p-4 transition-all z-50 bg-black/20 hover:bg-black/50 rounded-full backdrop-blur-[2px]"
                    >
                        <ChevronLeft size={32} className="w-8 h-8 md:w-12 md:h-12" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3 md:p-4 transition-all z-50 bg-black/20 hover:bg-black/50 rounded-full backdrop-blur-[2px]"
                    >
                        <ChevronRight size={32} className="w-8 h-8 md:w-12 md:h-12" />
                    </button>

                    {/* Main Image */}
                    <div
                        className="relative max-w-[100vw] max-h-[100vh] flex flex-col items-center p-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={typeof images[selectedIndex].image_url === 'string' ? images[selectedIndex].image_url : images[selectedIndex].image_url.src}
                            alt={images[selectedIndex].alt_text || "Gallery image"}
                            className="max-w-full max-h-[80vh] md:max-h-[85vh] object-contain rounded-sm shadow-2xl"
                        />
                        <p className="text-white/80 mt-4 text-center font-body tracking-wide px-8 text-sm md:text-base">
                            {images[selectedIndex].alt_text}
                        </p>
                    </div>
                </div>,
                document.body
            )}
        </section>
    );
};

export default Gallery;
