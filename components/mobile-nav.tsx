"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavLinkItem } from "@/lib/nav-links";

export function MobileNav({
	lang,
	links,
}: {
	lang: "fr-fr" | "en-gb";
	links: NavLinkItem[];
}) {
	const [open, setOpen] = useState(false);
	const homeHref = lang === "en-gb" ? "/en" : "/";
	const joinLabel = lang === "en-gb" ? "Join us" : "Nous rejoindre";

	return (
		<div className="lg:hidden">
			<button
				type="button"
				className="inline-flex items-center justify-center rounded-md border border-white/20 p-2 text-white"
				aria-expanded={open}
				aria-controls="mobile-nav-drawer"
				onClick={() => setOpen((o) => !o)}
			>
				<span className="sr-only">Menu</span>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					{open ? (
						<path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
					) : (
						<>
							<path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
						</>
					)}
				</svg>
			</button>

			{open ? (
				<div
					className="fixed inset-0 top-[52px] z-40 bg-pg-deep/98 px-4 py-6 backdrop-blur-sm"
					id="mobile-nav-drawer"
				>
					<nav className="flex flex-col gap-4" aria-label="Mobile main">
						{links.map((item) => {
							const internal = item.href.startsWith("/") && !item.href.startsWith("//");
							if (internal) {
								return (
									<Link
										key={`${item.href}-${item.label}`}
										href={item.href}
										className="border-b border-white/10 py-3 text-lg font-medium text-white"
										onClick={() => setOpen(false)}
									>
										{item.label}
									</Link>
								);
							}
							return (
								<a
									key={`${item.href}-${item.label}`}
									href={item.href}
									className="border-b border-white/10 py-3 text-lg font-medium text-white"
									onClick={() => setOpen(false)}
								>
									{item.label}
								</a>
							);
						})}
						<Link
							href={`${homeHref}#join`}
							className="mt-4 inline-flex justify-center rounded-md bg-pg-gold-bright py-3 font-display font-bold uppercase text-pg-deep"
							onClick={() => setOpen(false)}
						>
							{joinLabel}
						</Link>
					</nav>
				</div>
			) : null}
		</div>
	);
}
