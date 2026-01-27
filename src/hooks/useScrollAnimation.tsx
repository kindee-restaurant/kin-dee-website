"use client";

import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
    const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [threshold, rootMargin, triggerOnce]);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleScroll = () => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementTop = rect.top;
            const elementHeight = rect.height;

            // Calculate progress from 0 to 1 as element scrolls through viewport
            const progress = Math.max(0, Math.min(1,
                (windowHeight - elementTop) / (windowHeight + elementHeight)
            ));
            setScrollProgress(progress);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return { ref, isVisible, scrollProgress };
};

// Parallax hook for background images
export const useParallax = (speed: number = 0.5) => {
    const ref = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleScroll = () => {
            const rect = element.getBoundingClientRect();
            const scrolled = window.scrollY;
            const rate = scrolled * speed;
            setOffset(rate);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [speed]);

    return { ref, offset };
};
