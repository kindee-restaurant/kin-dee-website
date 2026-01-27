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

    // Experimental features
    experimental: {
        // Enable server actions
        serverActions: {
            bodySizeLimit: "2mb",
        },
    },
};

export default nextConfig;
