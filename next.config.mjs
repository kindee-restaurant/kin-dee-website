/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better development experience
    reactStrictMode: true,

    // Image optimization configuration
    images: {
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
