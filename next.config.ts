import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
  agentRules: false,
  async redirects() {
    return [
      { source: "/learn", destination: "/guides", permanent: false },
      { source: "/learn/:path*", destination: "/guides", permanent: false },
    ];
  },
};

export default nextConfig;
