import { Cinzel, DM_Sans, Great_Vibes, Playfair_Display } from "next/font/google";

// Self-hosted at build time: no request to Google at page load, no layout shift.
export const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
    display: "swap",
    variable: "--font-playfair",
});
export const dmSans = DM_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
    display: "swap",
    variable: "--font-dm-sans",
});
export const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-great-vibes" });
export const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-cinzel" });

export const fontVariables = [playfair.variable, dmSans.variable, greatVibes.variable, cinzel.variable].join(" ");
