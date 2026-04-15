import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	async redirects() {
		return [
			{ source: "/entrainements", destination: "/#training", permanent: false },
			{ source: "/training", destination: "/en#training", permanent: false },
			{ source: "/calendrier", destination: "/#training", permanent: false },
			{ source: "/club-calendar", destination: "/en#training", permanent: false },
			{ source: "/contact-fr", destination: "/#join", permanent: false },
			{ source: "/contact-en", destination: "/en#join", permanent: false },
		];
	},
};

export default nextConfig;
