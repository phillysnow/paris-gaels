import * as prismic from "@prismicio/client";
import { cache } from "react";
import type { Metadata } from "next";

import { CardShell, CardInner, formatArticleDate } from "@/components/NewsArticleCard";
import { getLocales } from "@/lib/getLocales";
import { navItemsFromSlices } from "@/lib/sectionNavFromSlices";
import {
	prismicDocumentHrefForApp,
	prismicLocaleForQuery,
	reverseLocaleLookup,
	urlSegmentForPrismicLang,
} from "@/i18n";
import { createClient } from "@/prismicio";

import { Layout } from "@/components/Layout";

type PageProps = { params: Promise<{ lang: string }> };

const loadHomeLanding = cache(async (prismicLang: string | undefined) => {
	const client = createClient();
	return client.getByUID("landing_page", "home", { lang: prismicLang });
});

const pageCopy: Record<string, { titleLead: string; titleAccent: string; eyebrow: string; metaTitle: string }> = {
	en: {
		titleLead: "Club",
		titleAccent: "News",
		eyebrow: "LATEST UPDATES",
		metaTitle: "Club News",
	},
	fr: {
		titleLead: "Actualités",
		titleAccent: "du club",
		eyebrow: "DERNIÈRES NOUVELLES",
		metaTitle: "Actualités du club",
	},
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	const copy = pageCopy[lang] ?? pageCopy.en;
	return { title: copy.metaTitle };
}

export default async function Page({ params }: PageProps) {
	const { lang } = await params;
	const client = createClient();
	const prismicLang = prismicLocaleForQuery(lang) ?? reverseLocaleLookup(String(lang));
	const copy = pageCopy[lang] ?? pageCopy.en;

	const [page, settings, articles] = await Promise.all([
		loadHomeLanding(prismicLang),
		client.getSingle("site_settings", { lang: prismicLang }).catch(() => null),
		client.getAllByType("article", {
			lang: prismicLang,
			orderings: [{ field: "document.first_publication_date", direction: "asc" }],
		}),
	]);

	const allLocales = await getLocales(page, client);
	const locales = allLocales.slice(1);
	const sectionNavItems = navItemsFromSlices(page.data.slices);
	const basePath = `/${lang}`;

	return (
		<Layout
			locales={locales}
			settings={settings}
			sectionNavItems={sectionNavItems}
			basePath={basePath}
		>
			<section className="border-t border-black/[0.06] bg-pg-warm px-4 py-20 sm:py-28">
				<div className="mx-auto max-w-content text-center">
					<p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-pg-red">
						{copy.eyebrow}
					</p>
					<h1 className="mt-3 font-display text-3xl font-bold text-pg-ink sm:text-4xl md:text-5xl">
						<span>{copy.titleLead} </span>
						<span className="text-pg-red">{copy.titleAccent}</span>
					</h1>
				</div>
				<ul className="mx-auto mt-14 grid max-w-content gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{articles.map((article) => {
						const href = prismicDocumentHrefForApp(article.url);
						const data = article.data as Record<string, unknown>;
						const title = (data.meta_title as string | undefined)?.trim() || article.uid;
						const summary = (data.excerpt as string | undefined)?.trim() || null;
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
		</Layout>
	);
}

export async function generateStaticParams(): Promise<{ lang: string }[]> {
	const client = createClient();

	const pages = await client.getAllByType("landing_page", {
		lang: "*",
		filters: [prismic.filter.at("my.landing_page.uid", "home")],
	});

	return pages
		.map((page) => {
			const lang = urlSegmentForPrismicLang(page.lang);
			if (!lang) return null;
			return { lang };
		})
		.filter((item): item is { lang: string } => item !== null);
}
