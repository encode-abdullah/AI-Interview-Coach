import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress SWC warning on Windows — using webpack fallback
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
