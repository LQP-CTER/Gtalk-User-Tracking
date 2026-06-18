import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from external sources if needed
  images: {
    remotePatterns: [],
  },
  // Headers for CORS if needed
  async headers() {
    return [];
  },
};

export default nextConfig;
