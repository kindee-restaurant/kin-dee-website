import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    title: {
        default: "Kin Dee | Thai & Asian Fusion Restaurant Dublin | Leeson Street",
        template: "%s | Kin Dee Restaurant Dublin",
    },
    description:
        "Kin Dee is Dublin's premier Thai and Asian Fusion restaurant on Leeson Street. Experience authentic Thai classics and innovative fusion cuisine in an elegant setting. Book your table today.",
    keywords: [
        "Thai restaurant Dublin",
        "Asian fusion Leeson Street",
        "Thai food Dublin",
        "best Thai restaurant Dublin",
        "Kin Dee Dublin",
        "Asian restaurant Dublin 2",
    ],
    authors: [{ name: "Kin Dee Restaurant" }],
    creator: "Kin Dee Restaurant",
    metadataBase: new URL("https://kindee.ie"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_IE",
        url: "https://kindee.ie",
        siteName: "Kin Dee Restaurant",
        title: "Kin Dee | Thai & Asian Fusion Restaurant Dublin",
        description:
            "Experience authentic Thai classics and innovative Asian fusion cuisine at Dublin's premier restaurant on Leeson Street.",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Kin Dee Restaurant Dublin",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Kin Dee | Thai & Asian Fusion Restaurant Dublin",
        description:
            "Experience authentic Thai classics and innovative Asian fusion cuisine at Dublin's premier restaurant on Leeson Street.",
        images: ["/og-image.jpg"],
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
    icons: {
        icon: "/favicon.ico",
    },
};

// JSON-LD Structured Data for Restaurant
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Kin Dee",
    image: "https://kindee.ie/images/restaurant.jpg",
    description:
        "Thai and Asian Fusion restaurant in Dublin offering authentic Thai classics and innovative fusion cuisine",
    address: {
        "@type": "PostalAddress",
        streetAddress: "133 Leeson Street Upper",
        addressLocality: "Dublin",
        addressRegion: "Dublin",
        postalCode: "D04HX48",
        addressCountry: "IE",
    },
    geo: {
        "@type": "GeoCoordinates",
        latitude: 53.3331,
        longitude: -6.2568,
    },
    url: "https://kindee.ie",
    telephone: "+353-1-765-4321",
    servesCuisine: ["Thai", "Asian Fusion"],
    priceRange: "€€€",
    openingHoursSpecification: [
        {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
            opens: "17:00",
            closes: "22:00",
        },
        {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Friday", "Saturday"],
            opens: "17:00",
            closes: "23:00",
        },
        {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Sunday",
            opens: "13:00",
            closes: "21:00",
        },
    ],
    acceptsReservations: true,
    menu: "https://kindee.ie/#menu",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                {/* Geo Tags */}
                <meta name="geo.region" content="IE-D" />
                <meta name="geo.placename" content="Dublin" />
                <meta name="geo.position" content="53.3331;-6.2568" />
                <meta name="ICBM" content="53.3331, -6.2568" />
            </head>
            <body>
                <QueryProvider>
                    <AuthProvider>
                        <TooltipProvider>
                            <Toaster />
                            <Sonner />
                            {children}
                        </TooltipProvider>
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
