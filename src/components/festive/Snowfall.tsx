"use client";

import { useEffect, useState } from "react";

interface Flake {
    left: number;
    size: number;
    duration: number;
    delay: number;
    drift: number;
    opacity: number;
    glyph: boolean;
}

/** Light, CSS-only snow + gold sparkle overlay. Purely decorative; disabled for reduced-motion users. */
const Snowfall = ({ count = 22 }: { count?: number }) => {
    const [flakes, setFlakes] = useState<Flake[]>([]);

    useEffect(() => {
        // Generated on the client only so server and client HTML match.
        const n = window.innerWidth < 640 ? 8 : count;
        setFlakes(
            Array.from({ length: n }, () => ({
                left: Math.random() * 100,
                size: 3 + Math.random() * 7,
                duration: 9 + Math.random() * 12,
                delay: -Math.random() * 20,
                drift: (Math.random() - 0.5) * 80,
                opacity: 0.35 + Math.random() * 0.4,
                glyph: Math.random() < 0.4,
            }))
        );
    }, [count]);

    return (
        <div aria-hidden="true" className="festive-snow pointer-events-none fixed inset-0 z-40 overflow-hidden">
            {flakes.map((f, i) => (
                <span
                    key={i}
                    className="festive-flake"
                    style={{
                        left: `${f.left}%`,
                        fontSize: f.glyph ? `${f.size + 6}px` : undefined,
                        width: f.glyph ? undefined : `${f.size * 0.6}px`,
                        height: f.glyph ? undefined : `${f.size * 0.6}px`,
                        opacity: f.opacity,
                        animationDuration: `${f.duration}s`,
                        animationDelay: `${f.delay}s`,
                        ["--drift" as string]: `${f.drift}px`,
                    }}
                    data-glyph={f.glyph || undefined}
                    data-gold={(f.glyph && i % 2) || undefined}
                >
                    {f.glyph ? (i % 2 ? "✦" : "❄") : null}
                </span>
            ))}
        </div>
    );
};

export default Snowfall;
