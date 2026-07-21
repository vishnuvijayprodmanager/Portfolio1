import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so the stray lockfile higher up the tree is ignored.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
