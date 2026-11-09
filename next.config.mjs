/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better development experience
    reactStrictMode: true,

    // Image optimization configuration
    images: {
        // WebP only, and a short list of sizes: every format × size × quality combination counts against
        // Vercel's monthly image-optimisation allowance, and AVIF + the default 16 sizes used it all up.
        formats: ["image/webp"],
        deviceSizes: [640, 828, 1200, 1920],
        imageSizes: [96, 256, 384, 512],
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
