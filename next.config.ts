import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
      {
        hostname: 'img.icons8.com',
      },
      {
        hostname: 'cdn.activepieces.com',
      },
    ],
  },
};

export default nextConfig;
