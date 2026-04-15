import { Montserrat, Source_Sans_3 } from "next/font/google";
import { PrismicPreview } from "@prismicio/next";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { repositoryName } from "@/prismicio";

import "./globals.css";

const display = Montserrat({
	subsets: ["latin"],
	variable: "--font-display",
	weight: ["600", "700", "800"],
});

const sans = Source_Sans_3({
	subsets: ["latin"],
	variable: "--font-sans",
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: {
		default: "Paris Gaels GAA",
		template: "%s · Paris Gaels GAA",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html
			lang="fr"
			className={`${display.variable} ${sans.variable}`}
		>
			<body className="min-h-screen bg-pg-deep font-sans text-pg-ink antialiased">
				<PrismicPreview repositoryName={repositoryName} />
				{children}
			</body>
		</html>
	);
}
