import { ImageResponse } from "next/og";
import { LogoMark, loadLogoFont } from "@/lib/brandMark";

export const runtime = "edge";

// iPhone/iPad home-screen icon (iOS rounds the corners itself).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
    return new ImageResponse(<LogoMark size={180} />, {
        ...size,
        fonts: [{ name: "Playfair", data: await loadLogoFont(), weight: 700, style: "normal" }],
    });
}
