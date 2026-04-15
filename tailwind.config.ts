import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./slices/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				pg: {
					navy: "#0f172a",
					midnight: "#0B121E",
					deep: "#060b12",
					gold: "#EAB308",
					"gold-bright": "#FBBF24",
					muted: "#94a3b8",
					ink: "#e2e8f0",
					card: "#111827",
					"card-border": "#1e293b",
					blue: "#3b82f6",
					green: "#22c55e",
				},
			},
			fontFamily: {
				display: ["var(--font-display)", "system-ui", "sans-serif"],
				sans: ["var(--font-sans)", "system-ui", "sans-serif"],
			},
			maxWidth: {
				content: "72rem",
			},
		},
	},
	plugins: [typography],
} satisfies Config;
