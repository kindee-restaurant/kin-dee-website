import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Kin Dee – South East Asian Restaurant, Dublin 4",
        short_name: "Kin Dee",
        description: "South East Asian restaurant on Leeson Street Upper, Dublin 4.",
        start_url: "/",
        display: "browser",
        background_color: "#000000",
        theme_color: "#111111",
        icons: [
            { src: "/icon2.png", sizes: "192x192", type: "image/png" },
            { src: "/icon3.png", sizes: "512x512", type: "image/png" },
        ],
    };
}
