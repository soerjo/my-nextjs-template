import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle in .next/standalone for container images.
  output: "standalone",
  reactStrictMode: true,
};

export default nextConfig;
