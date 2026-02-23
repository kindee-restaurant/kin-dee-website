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
        default: "Kin Dee | South East Asian Cuisine Restaurant Dublin | Leeson Street",
        template: "%s | Kin Dee Restaurant Dublin",
    },
    description:
        "Kin Dee is Dublin's premier South East Asian Cuisine restaurant on Leeson Street. Experience authentic classics and innovative creations in an elegant setting. Book your table today.",
    keywords: [
        "South East Asian restaurant Dublin",
        "South East Asian Cuisine Leeson Street",
        "South East Asian food Dublin",
        "best South East Asian restaurant Dublin",
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
        title: "Kin Dee | South East Asian Cuisine Restaurant Dublin",
        description:
            "Experience authentic classics and innovative South East Asian cuisine at Dublin's premier restaurant on Leeson Street.",
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
        title: "Kin Dee | South East Asian Cuisine Restaurant Dublin",
        description:
            "Experience authentic classics and innovative South East Asian cuisine at Dublin's premier restaurant on Leeson Street.",
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

// JSON-LD Structured Data for Restaurant with Organization
const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": "https://kindee.ie/#restaurant",
    name: "Kin Dee",
    image: [
        "https://kindee.ie/images/restaurant.jpg",
        "https://kindee.ie/images/interior-1.jpg",
        "https://kindee.ie/images/food-hero.jpg",
    ],
    description:
        "South East Asian Cuisine restaurant in Dublin offering authentic classics and innovative creations in an elegant setting on Leeson Street.",
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
    telephone: "+353 1 963 6162",
    email: "info@kindee.ie",
    servesCuisine: ["Thai", "Asian Fusion", "Southeast Asian"],
    priceRange: "€€€",
    paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
    currenciesAccepted: "EUR",
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
    hasMenu: {
        "@type": "Menu",
        "@id": "https://kindee.ie/#menu",
        name: "Kin Dee Menu",
        url: "https://kindee.ie/#menu",
    },
    potentialAction: {
        "@type": "ReserveAction",
        target: {
            "@type": "EntryPoint",
            urlTemplate: "https://kindee.ie/#reservations",
            actionPlatform: [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform",
            ],
        },
        result: {
            "@type": "FoodEstablishmentReservation",
            name: "Table Reservation",
        },
    },
    areaServed: {
        "@type": "City",
        name: "Dublin",
    },
};

// Organization schema for brand identity
const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://kindee.ie/#organization",
    name: "Kin Dee Restaurant",
    url: "https://kindee.ie",
    logo: "https://kindee.ie/logo.png",
    contactPoint: {
        "@type": "ContactPoint",
        telephone: "+353 1 963 6162",
        contactType: "reservations",
        availableLanguage: ["English"],
    },
    sameAs: [
        "https://www.facebook.com/kindeedublin",
        "https://www.instagram.com/kindeedublin",
        "https://www.tripadvisor.ie/Restaurant_Review-Kin_Dee_Dublin",
    ],
};

// Breadcrumb for navigation structure
const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://kindee.ie",
        },
    ],
};

const jsonLd = [restaurantSchema, organizationSchema, breadcrumbSchema];

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
