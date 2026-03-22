import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lens.suzuri.jp" },
      { protocol: "https", hostname: "lens2.suzuri.jp" },
    ],
  },
};

export default nextConfig;
