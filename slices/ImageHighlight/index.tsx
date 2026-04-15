"use client";

import { isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";
import type { ImageHighlightSlice } from "@/prismicio-types";
import type { SliceZoneContext } from "@/slices/slice-context";

export default function ImageHighlight({
	slice,
	context: _ctx,
}: SliceComponentProps<ImageHighlightSlice, SliceZoneContext>) {
	return (
		<section className="bg-pg-navy px-4 py-12">
			{isFilled.image(slice.primary.image) ? (
				<figure className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-pg-card-border shadow-xl">
					<PrismicNextImage
						field={slice.primary.image}
						sizes="(max-width: 896px) 100vw, 896px"
					/>
					{isFilled.richText(slice.primary.caption) ? (
						<figcaption className="border-t border-pg-card-border bg-pg-card/80 px-4 py-3 text-center text-sm text-pg-muted">
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
