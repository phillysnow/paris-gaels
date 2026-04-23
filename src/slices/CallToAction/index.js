import { isFilled } from "@prismicio/client";
import { PrismicLink, PrismicRichText } from "@prismicio/react";
import { sliceSectionSurfaceClass } from "@/lib/sliceSurface";

export default function CallToAction({ slice, context: _ctx, index, slices }) {
	const links = slice.primary.cta ?? [];
	const surface = sliceSectionSurfaceClass(slice.slice_type, index, slices);

	return (
		<section className={`px-4 py-16 text-center ${surface}`}>
			<div className="mx-auto max-w-2xl">
				{isFilled.keyText(slice.primary.heading) ? (
					<h2 className="font-display text-2xl font-bold text-pg-ink md:text-3xl">
						{slice.primary.heading}
					</h2>
				) : null}
				{isFilled.richText(slice.primary.description) ? (
					<div className="mt-4 text-pg-muted [&_a]:text-pg-royal [&_a]:underline">
						<PrismicRichText field={slice.primary.description} />
					</div>
				) : null}
				{links.length > 0 ? (
					<div className="mt-8 flex flex-wrap justify-center gap-4">
						{links.map((link, i) =>
							isFilled.link(link) ? (
								<PrismicLink
									key={i}
									field={link}
									className="inline-flex rounded-md border-2 border-pg-red px-5 py-2.5 font-display text-sm font-semibold text-pg-red transition hover:bg-pg-red hover:text-white"
								/>
							) : null,
						)}
					</div>
				) : null}
			</div>
		</section>
	);
}
