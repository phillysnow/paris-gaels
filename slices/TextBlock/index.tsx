import { PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";
import type { TextBlockSlice } from "@/prismicio-types";
import type { SliceZoneContext } from "@/slices/slice-context";

/** Light “content band” so text stays readable on dark landings and on article pages. */
export default function TextBlock({
	slice,
	context: _ctx,
}: SliceComponentProps<TextBlockSlice, SliceZoneContext>) {
	return (
		<section className="bg-slate-100 px-4 py-16">
			<div className="prose prose-lg prose-slate mx-auto max-w-3xl prose-headings:font-display prose-a:text-pg-navy">
				<PrismicRichText field={slice.primary.body} />
			</div>
		</section>
	);
}
