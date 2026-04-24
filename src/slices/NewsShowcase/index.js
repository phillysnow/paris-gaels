import { isFilled } from "@prismicio/client";
import Link from "next/link";
import { PrismicLink } from "@prismicio/react";
import {
	CardInner,
	CardShell,
	formatArticleDate,
	newsCardClassName,
} from "@/components/NewsArticleCard";
import {
	prismicDocumentHrefForApp,
	prismicLocaleForQuery,
	urlSegmentForPrismicLang,
} from "@/i18n";
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

const viewAllLabelFallback = {
	en: "View all news",
	fr: "Toutes les actualités",
};

export default async function NewsShowcase({ slice, context, index, slices }) {
	const { primary, items } = slice;
	const anchor = sectionIdFromKeyText(primary.section_id, "news");
	const lang = prismicLocaleForQuery(context.lang) ?? context.lang;
	// Manual with no cards: fall back to latest articles (EN often left on "manual" with 0 items).
	const manualCount = Array.isArray(items) ? items.length : 0;
	const useLatest = primary.feed !== "manual" || manualCount === 0;
	const surface = sliceSectionSurfaceClass(slice.slice_type, index, slices);

	const eyebrow = isFilled.keyText(primary.eyebrow) ? primary.eyebrow : null;
	const title_white = isFilled.keyText(primary.title_white) ? primary.title_white : null;
	const title_gold = isFilled.keyText(primary.title_gold) ? primary.title_gold : null;

	const sectionClass = `px-4 py-20 sm:py-28 ${surface}`;

	if (useLatest) {
		const client = createClient();
		const { results: articles = [] } = await client.getByType("article", {
			lang,
			page: 1,
			pageSize: 3,
			orderings: [{ field: "document.first_publication_date", direction: "desc" }],
		});
		const segment = urlSegmentForPrismicLang(lang);
		const viewAllText = isFilled.keyText(primary.view_all_label)
			? primary.view_all_label.trim()
			: (viewAllLabelFallback[segment] ?? viewAllLabelFallback.en);

		return (
			<section id={anchor} className={sectionClass}>
				<SectionHeader eyebrow={eyebrow} title_white={title_white} title_gold={title_gold} />
				<ul className="mx-auto mt-14 grid max-w-content gap-8 md:grid-cols-3">
					{articles.map((article) => {
						const href = prismicDocumentHrefForApp(article.url);
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
				{segment ? (
					<div className="mx-auto mt-12 flex max-w-content justify-center">
						<Link
							href={`/${segment}/news`}
							className="inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-md bg-pg-red px-8 py-3 font-display text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-pg-red/35 transition hover:bg-red-600"
						>
							{viewAllText}
						</Link>
					</div>
				) : null}
			</section>
		);
	}

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
								<PrismicLink field={item.link} className={newsCardClassName}>
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
								<div className={newsCardClassName}>
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
