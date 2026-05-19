import type * as prismic from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";
import { SliceReveal } from "@/components/SliceReveal";
import { sliceSectionSurfaceClass } from "@/lib/sliceSurface";

type TextBlockProps = SliceComponentProps<prismic.Content.TextBlockSlice, { lang: string }>;

export default function TextBlock({ slice, context: _ctx, index, slices }: TextBlockProps) {
	const surface = sliceSectionSurfaceClass(slice.slice_type, index, slices);

	return (
		<SliceReveal variant="minimal" className={`px-4 py-16 ${surface}`}>
			<div className="slice-stack mx-auto max-w-3xl overflow-hidden">
				<div className="slice-stack-inner prose prose-lg prose-slate prose-headings:font-display prose-headings:text-pg-ink prose-p:text-pg-muted prose-a:text-pg-royal prose-strong:text-pg-ink">
					<PrismicRichText field={slice.primary.body} />
				</div>
			</div>
		</SliceReveal>
	);
}
