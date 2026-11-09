/** Shared by the generated favicon / apple icon / social image (edge runtime, so files are fetched, not read). */
export const loadLogoFont = () =>
    fetch(new URL("../assets/fonts/playfair-display-700.woff", import.meta.url)).then((r) => r.arrayBuffer());

export const loadBodyFont = () =>
    fetch(new URL("../assets/fonts/dm-sans-500.woff", import.meta.url)).then((r) => r.arrayBuffer());

export function LogoMark({ size, radius = 0 }: { size: number; radius?: number }) {
    // Two stacked lines stay legible even at 32px.
    const fontSize = Math.round(size * 0.36);
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#000",
                color: "#fff",
                borderRadius: radius,
                fontFamily: "Playfair",
                fontWeight: 700,
                fontSize,
                lineHeight: 0.92,
                letterSpacing: size >= 128 ? size * 0.01 : 0,
            }}
        >
            <span>KIN</span>
            <span>DEE</span>
        </div>
    );
}
