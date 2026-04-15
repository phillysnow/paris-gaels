import { isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceZone } from "@prismicio/react";
import type { ArticleDocument, LandingPageDocument } from "@/prismicio-types";
import { components } from "@/slices";
import type { SliceZoneContext } from "@/slices/slice-context";

function pageTitle(meta: string | null | undefined, uid: string) {
	return meta?.trim() || uid;
}

/** Long-scroll landing: slices own layout and section ids. */
export function LandingPageView({ doc }: { doc: LandingPageDocument }) {
	const context: SliceZoneContext = { lang: doc.lang };
	return (
		<article className="min-w-0">
			<SliceZone slices={doc.data.slices} components={components} context={context} />
		</article>
	);
}

export function ArticleView({ doc }: { doc: ArticleDocument }) {
	const title = pageTitle(doc.data.meta_title, doc.uid);
	const context: SliceZoneContext = { lang: doc.lang };

	return (
		<div className="min-h-screen bg-slate-50 py-10">
			<article className="mx-auto max-w-3xl px-4 py-6 text-slate-900 md:px-6">
			<header className="mb-8">
				<h1 className="font-display text-3xl font-bold text-pg-navy md:text-4xl">{title}</h1>
				{doc.data.publication_date ? (
					<time
						className="mt-2 block text-sm text-slate-500"
						dateTime={doc.data.publication_date}
					>
						{doc.data.publication_date}
					</time>
				) : null}
				{isFilled.keyText(doc.data.excerpt) ? (
					<p className="mt-4 text-lg text-slate-600">{doc.data.excerpt}</p>
				) : null}
			</header>
			{isFilled.image(doc.data.featured_image) ? (
				<div className="mb-10 overflow-hidden rounded-xl">
					<PrismicNextImage
						field={doc.data.featured_image}
						priority
						sizes="(max-width: 768px) 100vw, 768px"
					/>
				</div>
			) : null}
			<div className="prose prose-slate max-w-none prose-headings:font-display prose-a:text-pg-navy">
				<SliceZone slices={doc.data.slices} components={components} context={context} />
			</div>
		</article>
		</div>
	);
}
