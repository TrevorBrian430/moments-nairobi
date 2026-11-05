import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    qualities: [75, 85],
  },
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.100.22",
    "192.168.100.22:3000",
    "localhost:3005",
    "127.0.0.1:3005",
    "192.168.100.22:3005",
  ],
  cacheComponents: true,
  partialPrefetching: true,
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
