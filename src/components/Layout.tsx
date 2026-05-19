import clsx from "clsx";
import type * as prismic from "@prismicio/client";

import { Header } from "./Header";

interface LayoutProps {
  locales: Array<{ lang: string; lang_name: string; url: string | null }>;
  settings: prismic.PrismicDocument | null;
  sectionNavItems?: { anchor: string }[];
  basePath?: string;
  overlayOnHero?: boolean;
  children: React.ReactNode;
}

export function Layout({
	locales,
	settings,
	sectionNavItems = [],
	basePath = "",
	overlayOnHero = false,
	children,
}: LayoutProps) {
	return (
		<div className="text-pg-ink">
			<Header
				locales={locales}
				settings={settings}
				sectionNavItems={sectionNavItems}
				basePath={basePath}
				overlayOnHero={overlayOnHero}
			/>
			<main
				className={clsx(
					!overlayOnHero && "pt-24 md:pt-[5.75rem]",
				)}
			>
				{children}
			</main>
		</div>
	);
}
