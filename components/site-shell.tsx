import type { ReactNode } from "react";
import type { SiteSettingsDocument } from "@/prismicio-types";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteShell({
	lang,
	settings,
	children,
}: {
	lang: "fr-fr" | "en-gb";
	settings: SiteSettingsDocument | null;
	children: ReactNode;
}) {
	return (
		<>
			<SiteHeader lang={lang} settings={settings} />
			<div className="w-full min-w-0">{children}</div>
			<SiteFooter lang={lang} settings={settings} />
		</>
	);
}
