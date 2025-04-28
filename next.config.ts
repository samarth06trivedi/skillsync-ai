import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false, // This is crucial for pdf-parse to work
      path: false,
    };
    return config;
  },
};

export default nextConfig;
