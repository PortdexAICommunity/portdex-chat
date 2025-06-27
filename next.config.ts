import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    // Enable edge runtime globally for better serverless performance
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app', '*.pages.dev'],
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  // Optimize for edge deployment
  env: {
    EDGE_RUNTIME: 'true',
  },
};

export default nextConfig;
