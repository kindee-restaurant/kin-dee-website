// Matches the Christmas menu: gold foil, berry red, evergreen, warm white.
const COLORS = ["#d4a83a", "#b3202a", "#2f7a4f", "#f6e7bf"];
const BULBS = 36;

/** A string of twinkling fairy lights. Absolutely positioned; the parent must be `relative`. */
const ChristmasLights = ({ className = "" }: { className?: string }) => (
    <div aria-hidden="true" className={`pointer-events-none overflow-hidden h-5 ${className}`}>
        <svg className="absolute top-0 left-0 w-full h-3" preserveAspectRatio="none" viewBox="0 0 100 6">
            <path
                d={Array.from({ length: 25 }, (_, i) => `${i === 0 ? "M" : "Q"} ${i === 0 ? "0 1" : `${i * 4 - 2} 5 ${i * 4} 1`}`).join(" ")}
                fill="none"
                stroke="#2b3a2f"
                strokeWidth="0.35"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
        <div className="absolute inset-x-0 top-1 flex justify-between px-2">
            {Array.from({ length: BULBS }, (_, i) => (
                <span
                    key={i}
                    className={`festive-bulb ${i % 2 ? "festive-bulb-alt hidden md:block" : ""}`}
                    style={{
                        background: COLORS[i % COLORS.length],
                        color: COLORS[i % COLORS.length],
                        animationDelay: `${(i % 7) * 0.35}s`,
                    }}
                />
            ))}
        </div>
    </div>
);

export default ChristmasLights;
