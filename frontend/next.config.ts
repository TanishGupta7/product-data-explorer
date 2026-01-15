import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all for this assignment to avoid friction with scraping random images
      },
    ],
  },
};

export default nextConfig;
