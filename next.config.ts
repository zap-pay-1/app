import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    remotePatterns: [new URL('https://assets.coingecko.com/coins/images/**')],
  },
};

export default nextConfig;
