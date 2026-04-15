import Link from "next/link";
import { asLink, isFilled } from "@prismicio/client";
import type { SiteSettingsDocument } from "@/prismicio-types";
import { linkResolver } from "@/lib/linkResolver";

export function SiteFooter({
	lang,
	settings,
}: {
	lang: "fr-fr" | "en-gb";
	settings: SiteSettingsDocument | null;
}) {
	const homeHref = lang === "en-gb" ? "/en" : "/";

	const footer = (settings?.data.footer_links ?? []).filter(isFilled.link);
	const social = (settings?.data.social_links ?? []).filter(isFilled.link);

	return (
		<footer className="border-t border-white/10 bg-black px-4 py-12 text-center">
			<div className="mx-auto max-w-content">
				<Link href={homeHref} className="font-display text-xl font-extrabold tracking-tight text-white">
					PARIS <span className="text-pg-gold-bright">GAELS</span>{" "}
					<span className="text-pg-gold-bright">GAA</span>
				</Link>
				{footer.length > 0 ? (
					<nav className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-pg-muted">
						{footer.map((field, i) => {
							const href = asLink(field, { linkResolver }) ?? "#";
							const label = field.text?.trim() || href;
							const internal = href.startsWith("/") && !href.startsWith("//");
							if (internal) {
								return (
									<Link key={i} href={href} className="hover:text-pg-gold-bright">
										{label}
									</Link>
								);
							}
							return (
								<a key={i} href={href} className="hover:text-pg-gold-bright">
									{label}
								</a>
							);
						})}
					</nav>
				) : null}

				{social.length > 0 ? (
					<div className="mt-8 flex justify-center gap-4">
						{social.map((field, i) => {
							const href = asLink(field, { linkResolver }) ?? "#";
							const label = field.text?.trim() || "Social";
							return (
								<a
									key={i}
									href={href}
									className="rounded-full border border-white/20 p-2 text-pg-muted transition hover:border-pg-gold hover:text-pg-gold-bright"
									target="_blank"
									rel="noopener noreferrer"
									aria-label={label}
								>
									<span className="text-xs font-medium">{label}</span>
								</a>
							);
						})}
					</div>
				) : null}

				<p className="mt-10 text-xs text-pg-muted">
					© {new Date().getFullYear()} Paris Gaels GAA —{" "}
					{lang === "en-gb"
						? "Gaelic sports club in Paris, founded in 1995."
						: "Le club de sports gaéliques de Paris, fondé en 1995."}
				</p>
			</div>
		</footer>
	);
}
