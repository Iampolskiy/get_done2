import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sapphire-obliged-puma-478.mypinata.cloud",
        port: "",
        pathname: "/files/**",
      },
    ],
  },
};

export default nextConfig;
