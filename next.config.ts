import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  // Isolate local production previews from an already-running development server.
  distDir: process.env.DEVLADDER_BUILD_DIR || ".next",
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
