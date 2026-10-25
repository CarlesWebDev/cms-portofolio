import type { NextConfig } from "next";
const nextConfig: NextConfig = {
    experimental: {
        agentFeedback: true,
    },
    cacheComponents: true,
    partialPrefetching: true,
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
        ],
    },
    turbopack: {
        rules: {
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },
};
export default nextConfig;
