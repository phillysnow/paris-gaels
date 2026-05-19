import { isFilled } from "@prismicio/client";
import type * as prismic from "@prismicio/client";
import { PrismicLink, PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";
import { SliceReveal } from "@/components/SliceReveal";
import { sliceSectionSurfaceClass } from "@/lib/sliceSurface";

type CallToActionProps = SliceComponentProps<prismic.Content.CallToActionSlice, { lang: string }>;

export default function CallToAction({ slice, context: _ctx, index, slices }: CallToActionProps) {
	const links = slice.primary.cta ?? [];
	const surface = sliceSectionSurfaceClass(slice.slice_type, index, slices);

	return (
		<SliceReveal variant="centered" className={`px-4 py-16 text-center ${surface}`}>
			<div className="mx-auto max-w-2xl">
				{isFilled.keyText(slice.primary.heading) ? (
					<div className="slice-stack overflow-hidden">
						<h2 className="slice-stack-inner font-display text-2xl font-bold text-pg-ink md:text-3xl">
							{slice.primary.heading}
						</h2>
					</div>
				) : null}
				{isFilled.richText(slice.primary.description) ? (
					<div className="slice-stack mt-4 overflow-hidden">
						<div className="slice-stack-inner text-pg-muted [&_a]:text-pg-royal [&_a]:underline">
							<PrismicRichText field={slice.primary.description} />
						</div>
					</div>
				) : null}
				{links.length > 0 ? (
					<div className="slice-stack mt-8 overflow-hidden">
						<div className="slice-stack-inner flex flex-wrap justify-center gap-4">
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
					</div>
				) : null}
			</div>
		</SliceReveal>
	);
}
