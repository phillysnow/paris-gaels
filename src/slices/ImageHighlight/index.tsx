import { isFilled } from "@prismicio/client";
import type * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";
import { SliceReveal } from "@/components/SliceReveal";
import { sliceSectionSurfaceClass } from "@/lib/sliceSurface";

type ImageHighlightProps = SliceComponentProps<prismic.Content.ImageHighlightSlice, { lang: string }>;

export default function ImageHighlight({ slice, context: _ctx, index, slices }: ImageHighlightProps) {
	const surface = sliceSectionSurfaceClass(slice.slice_type, index, slices);

	return (
		<SliceReveal className={`px-4 py-12 ${surface}`}>
			{isFilled.image(slice.primary.image) ? (
				<figure className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-pg-card-border bg-pg-card shadow-lg shadow-black/10">
					<div className="slice-reveal-media overflow-hidden">
						<PrismicNextImage
							field={slice.primary.image}
							sizes="(max-width: 896px) 100vw, 896px"
						/>
					</div>
					{isFilled.richText(slice.primary.caption) ? (
						<div className="slice-stack overflow-hidden border-t border-pg-card-border bg-white">
							<figcaption className="slice-stack-inner px-4 py-3 text-center text-sm text-pg-muted">
								<PrismicRichText field={slice.primary.caption} />
							</figcaption>
						</div>
					) : null}
				</figure>
			) : isFilled.richText(slice.primary.caption) ? (
				<div className="slice-stack mx-auto max-w-3xl overflow-hidden">
					<div className="slice-stack-inner text-center text-sm text-pg-muted">
						<PrismicRichText field={slice.primary.caption} />
					</div>
				</div>
			) : null}
		</SliceReveal>
	);
}
