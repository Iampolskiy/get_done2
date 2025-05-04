import { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // ⬅️  Build läuft trotz ESLint‑Fehler
  },

  images: {
    /* domains: ["res.cloudinary.com"], */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      /* {
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
      }, */
    ],
  },
};

export default nextConfig;
