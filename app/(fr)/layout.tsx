import type { ReactNode } from "react";

import { SiteShell } from "@/components/site-shell";
import { getSiteSettings } from "@/lib/site-settings";

export default async function FrLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	const settings = await getSiteSettings("fr-fr");
	return <SiteShell lang="fr-fr" settings={settings}>{children}</SiteShell>;
}
