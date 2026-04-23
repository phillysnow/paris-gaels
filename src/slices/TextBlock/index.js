import { PrismicRichText } from "@prismicio/react";
import { sliceSectionSurfaceClass } from "@/lib/sliceSurface";

export default function TextBlock({ slice, context: _ctx, index, slices }) {
	const surface = sliceSectionSurfaceClass(slice.slice_type, index, slices);

	return (
		<section className={`px-4 py-16 ${surface}`}>
			<div className="prose prose-lg prose-slate mx-auto max-w-3xl prose-headings:font-display prose-headings:text-pg-ink prose-p:text-pg-muted prose-a:text-pg-royal prose-strong:text-pg-ink">
				<PrismicRichText field={slice.primary.body} />
			</div>
		</section>
	);
}
