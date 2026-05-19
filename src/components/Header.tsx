"use client";

import { useEffect, useState } from "react";
import * as prismic from "@prismicio/client";
import type { Content } from "@prismicio/client";
import clsx from "clsx";
import Link from "next/link";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

import { Bounded } from "./Bounded";

const localeLabels: Record<string, string> = {
	"en-gb": "🇮🇪",
	"fr-fr": "🇫🇷",
};

const SCROLL_SOLID_THRESHOLD_PX = 32;

const navLinkSolid =
	"font-display inline-flex items-center whitespace-nowrap rounded-md px-2.5 py-2 text-[0.8125rem] font-bold leading-none tracking-wide text-pg-ink antialiased ring-1 ring-transparent transition-[color,box-shadow,ring-color] duration-200 hover:bg-pg-red/8 hover:text-pg-ink hover:shadow-[0_6px_22px_-10px_rgba(229,45,47,0.35)] hover:ring-pg-red/40 md:text-[0.9375rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pg-red";

const navLinkOverlay =
	"font-display inline-flex items-center whitespace-nowrap rounded-md px-2.5 py-2 text-[0.8125rem] font-bold leading-none tracking-wide text-white antialiased ring-1 ring-transparent transition-[color,box-shadow,ring-color] duration-200 hover:bg-white/15 hover:text-white hover:shadow-[0_6px_22px_-10px_rgba(0,0,0,0.25)] hover:ring-white/35 md:text-[0.9375rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const localeLinkSolid =
	"flex h-9 min-w-[2.25rem] items-center justify-center rounded-full px-2 text-base leading-none text-pg-ink transition hover:bg-pg-red/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pg-red";

const localeLinkOverlay =
	"flex h-9 min-w-[2.25rem] items-center justify-center rounded-full px-2 text-base leading-none text-white transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

interface HeaderProps {
	locales: Array<{ lang: string; lang_name: string; url: string | null }>;
	settings: prismic.PrismicDocument | null;
	sectionNavItems?: { anchor: string }[];
	basePath?: string;
	overlayOnHero?: boolean;
}

export function Header({
	locales = [],
	settings,
	sectionNavItems = [],
	basePath = "",
	overlayOnHero = false,
}: HeaderProps) {
	const data = settings?.data as Content.SiteSettingsDocumentData | undefined;
	const primaryNav = data?.primary_navigation as
		| Array<{ url: prismic.LinkField; text: string }>
		| undefined;
	const hasSectionLinks = sectionNavItems.length > 0 && Boolean(basePath);
	const hasPrimaryLinks = Boolean(primaryNav?.length);

	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		if (!overlayOnHero) {
			return undefined;
		}

		const onScroll = () => {
			setScrolled(window.scrollY > SCROLL_SOLID_THRESHOLD_PX);
		};

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [overlayOnHero]);

	const useOverlayNav = overlayOnHero && !scrolled;
	const navLinkClass = useOverlayNav ? navLinkOverlay : navLinkSolid;
	const localeLinkClass = useOverlayNav ? localeLinkOverlay : localeLinkSolid;

	const shellClass =
		overlayOnHero
			? clsx(
					"fixed inset-x-0 top-0 z-50 w-full transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out",
					scrolled
						? "border-b border-slate-200/90 bg-white shadow-sm shadow-slate-900/5"
						: "border-b border-transparent bg-transparent shadow-none",
				)
			: "fixed inset-x-0 top-0 z-50 w-full border-b border-slate-200/90 bg-white shadow-sm shadow-slate-900/5";

	const dividerClass = useOverlayNav
		? "hidden h-8 w-px shrink-0 bg-white/30 sm:block"
		: "hidden h-8 w-px shrink-0 bg-pg-royal/25 sm:block";

	const localeShellClass = useOverlayNav
		? "inline-flex items-center rounded-full border border-white/35 bg-white/10 p-0.5 backdrop-blur-sm"
		: "inline-flex items-center rounded-full border border-slate-200/90 bg-white p-0.5";

	const logoShellClass = clsx(
		"inline-block outline-offset-4 focus-visible:rounded-sm",
		useOverlayNav && "[&_img]:drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]",
	);

	return (
		<header className={shellClass}>
			<Bounded yPadding="sm">
				<div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-6">
					<div className="flex shrink-0 justify-center md:justify-start">
						<PrismicNextLink href="/" className={logoShellClass}>
							<span className="sr-only">Go to homepage</span>
							{settings && prismic.isFilled.image(data?.header_banner) && (
								<PrismicNextImage
									field={data.header_banner}
									alt=""
									className="max-h-14 w-auto max-w-[min(100%,12rem)] object-contain md:max-h-16"
								/>
							)}
						</PrismicNextLink>
					</div>

					<div className="flex min-w-0 flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-end sm:gap-6 lg:gap-8">
						{(hasSectionLinks || hasPrimaryLinks) && (
							<nav
								aria-label="Main navigation"
								className="flex min-w-0 flex-wrap items-center justify-center gap-x-1.5 gap-y-2 sm:justify-end md:gap-x-2"
							>
								{hasSectionLinks ? (
									<ul className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 sm:justify-end md:gap-x-2">
										{sectionNavItems.map(({ anchor }) => (
											<li key={anchor}>
												<Link
													href={`${basePath}#${anchor}`}
													className={navLinkClass}
												>
													{anchor}
												</Link>
											</li>
										))}
									</ul>
								) : null}

								{hasSectionLinks && hasPrimaryLinks ? (
									<span className={dividerClass} aria-hidden="true" />
								) : null}

								{hasPrimaryLinks ? (
									<ul className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 sm:justify-end md:gap-x-2">
										{primaryNav!.map((item) => (
											<li key={item.text}>
												<PrismicNextLink
													field={item.url}
													className={navLinkClass}
												>
													{item.text}
												</PrismicNextLink>
											</li>
										))}
									</ul>
								) : null}
							</nav>
						)}

						{locales.length > 0 ? (
							<div className="flex items-center justify-center sm:justify-end">
								<div
									className={localeShellClass}
									role="group"
									aria-label="Language"
								>
									<ul className="flex items-center gap-0.5">
										{locales.map((locale) => (
											<li key={locale.lang}>
												<PrismicNextLink
													href={locale.url ?? "/"}
													aria-label={`Change language to ${locale.lang_name}`}
													className={localeLinkClass}
												>
													{localeLabels[locale.lang] || locale.lang}
												</PrismicNextLink>
											</li>
										))}
									</ul>
								</div>
							</div>
						) : null}
					</div>
				</div>
			</Bounded>
		</header>
	);
}
