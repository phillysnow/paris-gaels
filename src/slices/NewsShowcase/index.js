import { isFilled } from "@prismicio/client";
import Link from "next/link";
import { PrismicLink } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { sectionIdFromKeyText } from "@/lib/section-id";
import { sliceSectionSurfaceClass } from "@/lib/sliceSurface";

function SectionHeader({ eyebrow, title_white, title_gold }) {
	return (
		<div className="mx-auto max-w-content text-center">
			{eyebrow ? (
				<p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-pg-red">
					{eyebrow}
				</p>
			) : null}
			<h2 className="mt-3 font-display text-3xl font-bold text-pg-ink sm:text-4xl md:text-5xl">
				{title_white ? <span>{title_white} </span> : null}
				{title_gold ? <span className="text-pg-red">{title_gold}</span> : null}
			</h2>
		</div>
	);
}

function CardShell({ href, children }) {
	const className =
		"block overflow-hidden rounded-xl border border-pg-card-border bg-pg-card text-left shadow-sm shadow-black/5 transition hover:border-pg-red/45 hover:shadow-md";
	if (href.startsWith("/")) {
		return <Link href={href} className={className}>{children}</Link>;
	}
	return (
		<a href={href} className={className}>
			{children}
		</a>
	);
}

function CardInner({ category, date_display, headline, summary }) {
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

function formatArticleDate(d) {
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

export default async function NewsShowcase({ slice, context, index, slices }) {
	const { primary, items } = slice;
	const anchor = sectionIdFromKeyText(primary.section_id, "news");
	const lang = context.lang;
	const useLatest = primary.feed !== "manual";
	const surface = sliceSectionSurfaceClass(slice.slice_type, index, slices);

	const eyebrow = isFilled.keyText(primary.eyebrow) ? primary.eyebrow : null;
	const title_white = isFilled.keyText(primary.title_white) ? primary.title_white : null;
	const title_gold = isFilled.keyText(primary.title_gold) ? primary.title_gold : null;

	const sectionClass = `px-4 py-20 sm:py-28 ${surface}`;

	if (useLatest) {
		const client = createClient();
		const articles = await client.getAllByType("article", {
			lang,
			pageSize: 3,
			orderings: [{ field: "document.first_publication_date", direction: "desc" }],
		});

		return (
			<section id={anchor} className={sectionClass}>
				<SectionHeader eyebrow={eyebrow} title_white={title_white} title_gold={title_gold} />
				<ul className="mx-auto mt-14 grid max-w-content gap-8 md:grid-cols-3">
					{articles.map((article) => {
						const href = article.url ?? "#";
						const title = article.data.meta_title?.trim() || article.uid;
						const summary = article.data.excerpt?.trim() || null;
						const dateStr = formatArticleDate(article);
						return (
							<li key={article.id}>
								<CardShell href={href}>
									<div>
										<CardInner
											category="News"
											date_display={dateStr}
											headline={title}
											summary={summary}
										/>
									</div>
								</CardShell>
							</li>
						);
					})}
				</ul>
			</section>
		);
	}

	const cardClass =
		"block overflow-hidden rounded-xl border border-pg-card-border bg-pg-card text-left shadow-sm shadow-black/5 transition hover:border-pg-red/45 hover:shadow-md";

	return (
		<section id={anchor} className={sectionClass}>
			<SectionHeader eyebrow={eyebrow} title_white={title_white} title_gold={title_gold} />
			<ul className="mx-auto mt-14 grid max-w-content gap-8 md:grid-cols-3">
				{items.map((item, i) => {
					const category = isFilled.keyText(item.category) ? item.category : null;
					const date_display = isFilled.keyText(item.date_display) ? item.date_display : null;
					const headline = isFilled.keyText(item.headline) ? item.headline : null;
					const summary = isFilled.keyText(item.summary) ? item.summary : null;

					return (
						<li key={i}>
							{isFilled.link(item.link) ? (
								<PrismicLink field={item.link} className={cardClass}>
									<div>
										<CardInner
											category={category}
											date_display={date_display}
											headline={headline}
											summary={summary}
										/>
									</div>
								</PrismicLink>
							) : (
								<div className={cardClass}>
									<CardInner
										category={category}
										date_display={date_display}
										headline={headline}
										summary={summary}
									/>
								</div>
							)}
						</li>
					);
				})}
			</ul>
		</section>
	);
}
