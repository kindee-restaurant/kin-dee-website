import { ImageResponse } from "next/og";
import { LogoMark, loadLogoFont } from "@/lib/brandMark";

export const runtime = "edge";

// Favicon: black square with "KIN DEE" in white Playfair Display (the site's logo font).
// Several sizes so browser tabs (32), Google results (48) and Android/PWA (192, 512) all get a crisp version.
const SIZES = [32, 48, 192, 512];

export function generateImageMetadata() {
    return SIZES.map((s) => ({ id: String(s), size: { width: s, height: s }, contentType: "image/png" }));
}

export default async function Icon({ id }: { id: string }) {
    const size = Number(id) || 32;
    return new ImageResponse(<LogoMark size={size} />, {
        width: size,
        height: size,
        fonts: [{ name: "Playfair", data: await loadLogoFont(), weight: 700, style: "normal" }],
    });
}
