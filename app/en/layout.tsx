import type { ReactNode } from "react";

import { SiteShell } from "@/components/site-shell";
import { getSiteSettings } from "@/lib/site-settings";

export default async function EnglishLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	const settings = await getSiteSettings("en-gb");
	return (
		<div lang="en">
			<SiteShell lang="en-gb" settings={settings}>
				{children}
			</SiteShell>
		</div>
	);
}
