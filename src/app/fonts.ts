import localFont from "next/font/local";

// Fonts are bundled in src/assets/fonts (latin subset, from Fontsource / Google Fonts, SIL Open Font License),
// so builds never depend on reaching Google and pages make no font requests to third parties.

export const playfair = localFont({
    src: [
        { path: "../assets/fonts/playfair-display-400-normal.woff2", weight: "400", style: "normal" },
        { path: "../assets/fonts/playfair-display-500-normal.woff2", weight: "500", style: "normal" },
        { path: "../assets/fonts/playfair-display-600-normal.woff2", weight: "600", style: "normal" },
        { path: "../assets/fonts/playfair-display-700-normal.woff2", weight: "700", style: "normal" },
        { path: "../assets/fonts/playfair-display-400-italic.woff2", weight: "400", style: "italic" },
        { path: "../assets/fonts/playfair-display-500-italic.woff2", weight: "500", style: "italic" },
    ],
    display: "swap",
    variable: "--font-playfair",
});

export const dmSans = localFont({
    src: [
        { path: "../assets/fonts/dm-sans-400-normal.woff2", weight: "400", style: "normal" },
        { path: "../assets/fonts/dm-sans-500-normal.woff2", weight: "500", style: "normal" },
        { path: "../assets/fonts/dm-sans-600-normal.woff2", weight: "600", style: "normal" },
        { path: "../assets/fonts/dm-sans-700-normal.woff2", weight: "700", style: "normal" },
        { path: "../assets/fonts/dm-sans-400-italic.woff2", weight: "400", style: "italic" },
    ],
    display: "swap",
    variable: "--font-dm-sans",
});

export const greatVibes = localFont({
    src: [{ path: "../assets/fonts/great-vibes-400-normal.woff2", weight: "400", style: "normal" }],
    display: "swap",
    variable: "--font-great-vibes",
});

export const cinzel = localFont({
    src: [
        { path: "../assets/fonts/cinzel-400-normal.woff2", weight: "400", style: "normal" },
        { path: "../assets/fonts/cinzel-500-normal.woff2", weight: "500", style: "normal" },
        { path: "../assets/fonts/cinzel-600-normal.woff2", weight: "600", style: "normal" },
        { path: "../assets/fonts/cinzel-700-normal.woff2", weight: "700", style: "normal" },
    ],
    display: "swap",
    variable: "--font-cinzel",
});

export const fontVariables = [playfair.variable, dmSans.variable, greatVibes.variable, cinzel.variable].join(" ");
