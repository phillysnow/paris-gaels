import typography from "@tailwindcss/typography";

/** Paris Gaels club palette — see plan: royal, red, warm white, ink, alternating surfaces */
/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/slices/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				pg: {
					royal: "#0D529F",
					red: "#E52D2F",
					warm: "#F5F5F4",
					ink: "#1F2C56",
					muted: "#5c6b8c",
					"surface-blue": "#E8EEF6",
					anniversary: "#B79E69",
					/** Hero / dark immersive (gradient overlays) */
					midnight: "#0B121E",
					deep: "#060b12",
					navy: "#0f172a",
					/** Cards on light bands */
					card: "#ffffff",
					"card-border": "#e2e8f0",
					/** SportsGrid accent stripes */
					blue: "#0D529F",
					green: "#15803d",
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
};
