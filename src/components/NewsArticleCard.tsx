import Link from "next/link";
import type * as prismic from "@prismicio/client";

export const newsCardClassName =
	"block overflow-hidden rounded-xl border border-pg-card-border bg-pg-card text-left shadow-sm shadow-black/5 transition hover:border-pg-red/45 hover:shadow-md";

export function formatArticleDate(d: prismic.PrismicDocument): string {
	const raw = (d.data as Record<string, unknown>).publication_date;
	if (!raw) return "";
	try {
		return new Intl.DateTimeFormat(d.lang === "en-gb" ? "en-GB" : "fr-FR", {
			day: "numeric",
			month: "short",
			year: "numeric",
		}).format(new Date(raw as string));
	} catch {
		return raw as string;
	}
}

interface CardShellProps {
	href: string;
	children: React.ReactNode;
	className?: string;
}

export function CardShell({ href, children, className = "" }: CardShellProps) {
	const cls = [newsCardClassName, className].filter(Boolean).join(" ");
	if (href.startsWith("/")) {
		return (
			<Link href={href} className={cls}>
				{children}
			</Link>
		);
	}
	return (
		<a href={href} className={cls} rel="noopener noreferrer">
			{children}
		</a>
	);
}

interface CardInnerProps {
	category: string | null;
	date_display: string | null;
	headline: string | null;
	summary: string | null;
}

export function CardInner({ category, date_display, headline, summary }: CardInnerProps) {
	return (
		<>
			<div
				className="h-1 w-full rounded-full bg-gradient-to-r from-pg-royal to-pg-red"
				aria-hidden
			/>
			<div className="p-6">
				<div className="mb-4 flex items-center justify-between gap-2">
					{category ? (
						<span className="rounded-full bg-pg-red px-3 py-1 text-xs font-bold text-white">
							{category}
						</span>
					) : (
						<span />
					)}
					{date_display ? (
						<span className="text-xs text-pg-muted">{date_display}</span>
					) : null}
				</div>
				{headline ? (
					<h3 className="font-display text-lg font-bold text-pg-ink">{headline}</h3>
				) : null}
				{summary ? (
					<p className="mt-3 text-sm leading-relaxed text-pg-muted">{summary}</p>
				) : null}
			</div>
		</>
	);
}
