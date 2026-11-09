/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better development experience
    reactStrictMode: true,

    // Image optimization configuration
    images: {
        // Serve AVIF where supported (typically 20–50% smaller than WebP), WebP otherwise.
        formats: ["image/avif", "image/webp"],
        // Keep optimised images cached for 31 days instead of re-encoding them every minute.
        minimumCacheTTL: 2678400,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "yryucyqnupxkdchmmzmq.supabase.co",
                pathname: "/storage/v1/object/public/**",
            },
        ],
    },

    // Keep the admin area out of search results.
    async headers() {
        return [{ source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
    },

    // Experimental features
    experimental: {
        // Enable server actions
        serverActions: {
            bodySizeLimit: "2mb",
        },
    },
};

export default nextConfig;
