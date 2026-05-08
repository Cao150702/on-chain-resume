import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    esmExternals: "loose",
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
