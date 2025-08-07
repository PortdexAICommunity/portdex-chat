import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		ppr: true,
		webpackMemoryOptimizations: true,
	},
	output: "standalone",
	images: {
		remotePatterns: [
			{
				hostname: "avatar.vercel.sh",
			},
			{
				hostname: "img.icons8.com",
			},
			{
				hostname: "cdn.activepieces.com",
			},
			{
				hostname: "images.pexels.com",
			},
		],
	},
};

export default nextConfig;
