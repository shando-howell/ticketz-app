import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "https://pleasant-guineapig-636.convex.cloud",
        protocol: "http",
      }
    ]
  }
};

export default nextConfig;
