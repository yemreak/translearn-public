import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		serverActions: {
			bodySizeLimit: "50mb",
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
		],
	},
}

export default nextConfig
