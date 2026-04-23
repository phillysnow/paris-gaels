"use client";

import { isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { sliceSectionSurfaceClass } from "@/lib/sliceSurface";

export default function ImageHighlight({ slice, context: _ctx, index, slices }) {
	const surface = sliceSectionSurfaceClass(slice.slice_type, index, slices);

	return (
		<section className={`px-4 py-12 ${surface}`}>
			{isFilled.image(slice.primary.image) ? (
				<figure className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-pg-card-border bg-pg-card shadow-lg shadow-black/10">
					<PrismicNextImage
						field={slice.primary.image}
						sizes="(max-width: 896px) 100vw, 896px"
					/>
					{isFilled.richText(slice.primary.caption) ? (
						<figcaption className="border-t border-pg-card-border bg-white px-4 py-3 text-center text-sm text-pg-muted">
							<PrismicRichText field={slice.primary.caption} />
						</figcaption>
					) : null}
				</figure>
			) : isFilled.richText(slice.primary.caption) ? (
				<div className="mx-auto max-w-3xl text-center text-sm text-pg-muted">
					<PrismicRichText field={slice.primary.caption} />
				</div>
			) : null}
		</section>
	);
}
