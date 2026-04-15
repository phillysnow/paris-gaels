import Link from "next/link";
import type { SiteSettingsDocument } from "@/prismicio-types";
import { fallbackNav, navLinksFromRepeatable } from "@/lib/nav-links";
import { MobileNav } from "@/components/mobile-nav";

function NavItem({ href, label }: { href: string; label: string }) {
	const internal = href.startsWith("/") && !href.startsWith("//");
	const className =
		"text-sm font-medium text-white/90 transition hover:text-pg-gold-bright";
	if (internal) {
		return (
			<Link href={href} className={className}>
				{label}
			</Link>
		);
	}
	return (
		<a href={href} className={className}>
			{label}
		</a>
	);
}

export function SiteHeader({
	lang,
	settings,
}: {
	lang: "fr-fr" | "en-gb";
	settings: SiteSettingsDocument | null;
}) {
	const homeHref = lang === "en-gb" ? "/en" : "/";
	const fromCms = navLinksFromRepeatable(settings?.data.primary_navigation ?? []);
	const links = fromCms.length > 0 ? fromCms : fallbackNav(lang);
	const tagline = settings?.data.club_tagline?.trim();

	return (
		<header className="sticky top-0 z-50 border-b border-white/10 bg-pg-midnight/95 backdrop-blur-md">
			<div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3 md:py-4">
				<Link href={homeHref} className="group flex shrink-0 flex-col">
					<span className="font-display text-lg font-extrabold tracking-tight text-white md:text-xl">
						PARIS <span className="text-pg-gold-bright">GAELS</span>{" "}
						<span className="text-pg-gold-bright">GAA</span>
					</span>
					{tagline ? (
						<span className="hidden text-xs text-pg-muted sm:block">{tagline}</span>
					) : null}
				</Link>

				<nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
					{links.map((item) => (
						<NavItem key={`${item.href}-${item.label}`} href={item.href} label={item.label} />
					))}
				</nav>

				<div className="flex items-center gap-3">
					<Link
						href={`${homeHref}#join`}
						className="hidden rounded-md bg-pg-gold-bright px-4 py-2 font-display text-xs font-bold uppercase tracking-wide text-pg-deep shadow-md transition hover:bg-pg-gold sm:inline-flex"
					>
						{lang === "en-gb" ? "Join us" : "Nous rejoindre"}
					</Link>
					<MobileNav lang={lang} links={links} />
				</div>
			</div>
		</header>
	);
}
