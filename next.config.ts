// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.lichess1.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lichess1.org",
        pathname: "/**",
      },
      // Add other domains as needed
    ],
    minimumCacheTTL: 3600, // Cache optimized images for 1 hour
    formats: ["image/webp"], // Prefer WebP format
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["geist"], // Optional: Optimize Geist font imports
  },
  // Enable React Strict Mode (recommended)
  reactStrictMode: true,
  // Configure modularizeImports for better bundle sizes
  modularizeImports: {
    "@geist-ui/icons": {
      transform: "@geist-ui/icons/dist/{{ kebabCase member }}",
      skipDefaultConversion: true,
    },
  },
};

export default nextConfig;