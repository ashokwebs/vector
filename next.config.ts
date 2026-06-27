import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/api/**',
      },
    ],
  },
  // Silence harmless warnings from framer-motion & recharts on SSR
  serverExternalPackages: [],
};

export default nextConfig;
