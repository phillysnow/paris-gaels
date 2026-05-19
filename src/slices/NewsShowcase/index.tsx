import { isFilled } from "@prismicio/client";
import type * as prismic from "@prismicio/client";
import Link from "next/link";
import { PrismicLink } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";
import {
	CardInner,
	CardShell,
	formatArticleDate,
	newsCardClassName,
} from "@/components/NewsArticleCard";
import { SliceReveal } from "@/components/SliceReveal";
import {
	prismicDocumentHrefForApp,
	prismicLocaleForQuery,
	urlSegmentForPrismicLang,
} from "@/i18n";
import { createClient } from "@/prismicio";
import { sectionIdFromKeyText } from "@/lib/section-id";
import { sliceSectionSurfaceClass } from "@/lib/sliceSurface";

type NewsShowcaseProps = SliceComponentProps<prismic.Content.NewsShowcaseSlice, { lang: string }>;

interface SectionHeaderProps {
	eyebrow: string | null;
	title_white: string | null;
	title_gold: string | null;
}

function SectionHeader({ eyebrow, title_white, title_gold }: SectionHeaderProps) {
	return (
		<div className="mx-auto max-w-content text-center">
			{eyebrow ? (
				<div className="slice-stack overflow-hidden">
					<p className="slice-stack-inner font-display text-sm font-semibold uppercase tracking-[0.2em] text-pg-red">
						{eyebrow}
					</p>
				</div>
			) : null}
			<div className="slice-stack mt-3 overflow-hidden">
				<h2 className="slice-stack-inner font-display text-3xl font-bold text-pg-ink sm:text-4xl md:text-5xl">
					{title_white ? <span>{title_white} </span> : null}
					{title_gold ? <span className="text-pg-red">{title_gold}</span> : null}
				</h2>
			</div>
		</div>
	);
}

const viewAllLabelFallback: Record<string, string> = {
	en: "View all news",
	fr: "Toutes les actualités",
};

export default async function NewsShowcase({ slice, context, index, slices }: NewsShowcaseProps) {
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
			: (viewAllLabelFallback[segment ?? "en"] ?? viewAllLabelFallback.en);

		return (
			<SliceReveal id={anchor} className={sectionClass}>
				<SectionHeader eyebrow={eyebrow} title_white={title_white} title_gold={title_gold} />
				<ul className="slice-items mx-auto mt-14 grid max-w-content list-none gap-8 p-0 md:grid-cols-3">
					{articles.map((article) => {
						const href = prismicDocumentHrefForApp(article.url);
						const title = (article.data as Record<string, unknown>).meta_title as string | undefined;
						const summary = (article.data as Record<string, unknown>).excerpt as string | undefined;
						const displayTitle = title?.trim() || article.uid;
						const displaySummary = summary?.trim() || null;
						const dateStr = formatArticleDate(article);
						return (
							<li key={article.id} className="slice-stack overflow-hidden">
								<CardShell href={href} className="slice-stack-inner block h-full">
									<div>
										<CardInner
											category="News"
											date_display={dateStr}
											headline={displayTitle}
											summary={displaySummary}
										/>
									</div>
								</CardShell>
							</li>
						);
					})}
				</ul>
				{segment ? (
					<div className="slice-stack mx-auto mt-12 flex max-w-content justify-center overflow-hidden">
						<div className="slice-stack-inner">
							<Link
								href={`/${segment}/news`}
								className="inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-md bg-pg-red px-8 py-3 font-display text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-pg-red/35 transition hover:bg-red-600"
							>
								{viewAllText}
							</Link>
						</div>
					</div>
				) : null}
			</SliceReveal>
		);
	}

	return (
		<SliceReveal id={anchor} className={sectionClass}>
			<SectionHeader eyebrow={eyebrow} title_white={title_white} title_gold={title_gold} />
			<ul className="slice-items mx-auto mt-14 grid max-w-content list-none gap-8 p-0 md:grid-cols-3">
				{items.map((item, i) => {
					const category = isFilled.keyText(item.category) ? item.category : null;
					const date_display = isFilled.keyText(item.date_display) ? item.date_display : null;
					const headline = isFilled.keyText(item.headline) ? item.headline : null;
					const summary = isFilled.keyText(item.summary) ? item.summary : null;

					return (
						<li key={i} className="slice-stack overflow-hidden">
							{isFilled.link(item.link) ? (
								<PrismicLink field={item.link} className={`${newsCardClassName} slice-stack-inner block h-full`}>
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
								<div className={`${newsCardClassName} slice-stack-inner block h-full`}>
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
		</SliceReveal>
	);
}
