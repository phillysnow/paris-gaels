import { isFilled } from "@prismicio/client";
import { PrismicLink, PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";
import type { CallToActionSlice } from "@/prismicio-types";
import type { SliceZoneContext } from "@/slices/slice-context";

export default function CallToAction({
	slice,
	context: _ctx,
}: SliceComponentProps<CallToActionSlice, SliceZoneContext>) {
	const links = slice.primary.cta ?? [];

	return (
		<section className="bg-pg-deep px-4 py-16 text-center">
			<div className="mx-auto max-w-2xl">
				{isFilled.keyText(slice.primary.heading) ? (
					<h2 className="font-display text-2xl font-bold text-white md:text-3xl">
						{slice.primary.heading}
					</h2>
				) : null}
				{isFilled.richText(slice.primary.description) ? (
					<div className="mt-4 text-pg-muted [&_a]:text-pg-gold-bright [&_a]:underline">
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
									className="inline-flex rounded-md border border-pg-gold px-5 py-2.5 font-display text-sm font-semibold text-pg-gold-bright transition hover:bg-pg-gold/10"
								/>
							) : null,
						)}
					</div>
				) : null}
			</div>
		</section>
	);
}
