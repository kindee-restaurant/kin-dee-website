"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * "Back to top" pill, centred just under the fixed header. Rendered inside <Header>
 * (absolutely positioned against it), so it always sits below the header whatever its height.
 * Appears once the visitor has scrolled past the hero.
 */
const BackToTop = ({ className }: { className?: string }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            aria-hidden={!visible}
            tabIndex={visible ? 0 : -1}
            className={cn(
                "absolute left-1/2 top-full mt-3 -translate-x-1/2",
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2",
                "bg-foreground/90 text-background backdrop-blur-sm shadow-elevated border border-background/10",
                "font-body text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em]",
                "hover:bg-primary hover:text-primary-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "transition-all duration-300",
                visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none",
                className
            )}
        >
            <ArrowUp className="w-3.5 h-3.5" />
            Back to top
        </button>
    );
};

export default BackToTop;
