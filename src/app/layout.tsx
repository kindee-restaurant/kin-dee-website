import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/AuthProvider";
import FloatingCTAs from "@/components/FloatingCTAs";
import "./globals.css";
import { fontVariables } from "./fonts";
import { GEO, META_DESCRIPTION, SITE_URL } from "@/lib/seo";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#111111",
};

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Kin Dee | South East Asian Restaurant, Leeson Street, Dublin 4",
        template: "%s | Kin Dee Dublin",
    },
    description: META_DESCRIPTION,
    applicationName: "Kin Dee",
    keywords: [
        "Kin Dee",
        "Kin Dee Dublin",
        "South East Asian restaurant Dublin",
        "Thai restaurant Dublin 4",
        "Thai restaurant Leeson Street",
        "Asian fusion restaurant Dublin",
        "restaurant Leeson Street Upper",
        "restaurants near Ranelagh",
        "restaurants Ballsbridge",
        "Thai takeaway Dublin 4",
        "Phad Thai Dublin",
    ],
    authors: [{ name: "Kin Dee Restaurant", url: SITE_URL }],
    creator: "Kin Dee Restaurant",
    publisher: "Kin Dee Restaurant",
    category: "restaurant",
    openGraph: {
        type: "website",
        locale: "en_IE",
        url: SITE_URL,
        siteName: "Kin Dee Restaurant",
        title: "Kin Dee | South East Asian Restaurant, Leeson Street, Dublin 4",
        description: META_DESCRIPTION,
    },
    twitter: {
        card: "summary_large_image",
        title: "Kin Dee | South East Asian Restaurant, Dublin 4",
        description: META_DESCRIPTION,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    other: {
        "geo.region": "IE-D",
        "geo.placename": "Dublin",
        "geo.position": `${GEO.latitude};${GEO.longitude}`,
        ICBM: `${GEO.latitude}, ${GEO.longitude}`,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en-IE" className={fontVariables} suppressHydrationWarning>
            <body>
                <QueryProvider>
                    <AuthProvider>
                        <TooltipProvider>
                            <Toaster />
                            <Sonner />
                            {children}
                            <FloatingCTAs />
                        </TooltipProvider>
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
