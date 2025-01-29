import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    /* domains: ["gateway.pinata.cloud"], */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sapphire-obliged-puma-478.mypinata.cloud",
        port: "",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
        port: "",
        pathname: "/ipfs/**",
      },
    ],
  },
};

export default nextConfig;
