import Link from "next/link";

export const newsCardClassName =
	"block overflow-hidden rounded-xl border border-pg-card-border bg-pg-card text-left shadow-sm shadow-black/5 transition hover:border-pg-red/45 hover:shadow-md";

/**
 * @param {import("@prismicio/client").PrismicDocument} d
 */
export function formatArticleDate(d) {
	const raw = d.data.publication_date;
	if (!raw) return "";
	try {
		return new Intl.DateTimeFormat(d.lang === "en-gb" ? "en-GB" : "fr-FR", {
			day: "numeric",
			month: "short",
			year: "numeric",
		}).format(new Date(raw));
	} catch {
		return raw;
	}
}

export function CardShell({ href, children }) {
	if (href.startsWith("/")) {
		return (
			<Link href={href} className={newsCardClassName}>
				{children}
			</Link>
		);
	}
	return (
		<a href={href} className={newsCardClassName}>
			{children}
		</a>
	);
}

export function CardInner({ category, date_display, headline, summary }) {
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
