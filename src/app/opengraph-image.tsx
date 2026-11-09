import { ImageResponse } from "next/og";
import { loadBodyFont, loadLogoFont } from "@/lib/brandMark";

export const runtime = "edge";

// Preview image when kindee.ie is shared on WhatsApp, Facebook, iMessage, LinkedIn, X, Slack…
export const alt = "Kin Dee – South East Asian restaurant on Leeson Street, Dublin 4";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
    const [photo, playfair, dmSans] = await Promise.all([
        fetch(new URL("../assets/hero-image.jpg", import.meta.url)).then((r) => r.arrayBuffer()),
        loadLogoFont(),
        loadBodyFont(),
    ]);
    // @vercel/og accepts raw image bytes as <img src>.
    const photoSrc = photo as unknown as string;

    return new ImageResponse(
        (
            <div style={{ width: 1200, height: 630, display: "flex", background: "#0b0b0b" }}>
                <div
                    style={{
                        width: 800,
                        height: 630,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: "0 80px",
                        color: "#fff",
                    }}
                >
                    <div style={{ fontFamily: "Playfair", fontSize: 112, letterSpacing: 8, lineHeight: 1 }}>KIN DEE</div>
                    <div style={{ fontFamily: "DM Sans", fontSize: 28, letterSpacing: 7, marginTop: 20, color: "#e8dcc4" }}>
                        SOUTH EAST ASIAN CUISINE
                    </div>
                    <div style={{ width: 120, height: 2, background: "#c9a14a", margin: "36px 0" }} />
                    <div style={{ fontFamily: "DM Sans", fontSize: 30, color: "#f5f0e8" }}>133 Leeson Street Upper, Dublin 4</div>
                    <div style={{ fontFamily: "DM Sans", fontSize: 26, color: "#a89f91", marginTop: 12 }}>Book online at kindee.ie</div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                <img src={photoSrc} width={400} height={630} style={{ width: 400, height: 630, objectFit: "cover" }} />
            </div>
        ),
        {
            ...size,
            fonts: [
                { name: "Playfair", data: playfair, weight: 700, style: "normal" },
                { name: "DM Sans", data: dmSans, weight: 500, style: "normal" },
            ],
        }
    );
}
