import { isFilled } from "@prismicio/client";
import type * as prismic from "@prismicio/client";
import { PrismicLink, PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";
import { SliceReveal } from "@/components/SliceReveal";
import { sectionIdFromKeyText } from "@/lib/section-id";
import { sliceSectionSurfaceClass } from "@/lib/sliceSurface";

type JoinBandProps = SliceComponentProps<prismic.Content.JoinBandSlice, { lang: string }>;

export default function JoinBand({ slice, context: _ctx, index, slices }: JoinBandProps) {
	const { primary } = slice;
	const anchor = sectionIdFromKeyText(primary.section_id, "join");
	const surface = sliceSectionSurfaceClass(slice.slice_type, index, slices);

	return (
		<SliceReveal variant="centered" id={anchor} className={`px-4 py-20 text-center sm:py-28 ${surface}`}>
			<div className="mx-auto max-w-3xl">
				{isFilled.keyText(primary.eyebrow) ? (
					<div className="slice-stack overflow-hidden">
						<p className="slice-stack-inner font-display text-sm font-semibold uppercase tracking-[0.2em] text-pg-red">
							{primary.eyebrow}
						</p>
					</div>
				) : null}
				<div className="slice-stack mt-3 overflow-hidden">
					<h2 className="slice-stack-inner font-display text-3xl font-bold text-pg-ink sm:text-4xl md:text-5xl">
						{isFilled.keyText(primary.title_gold) ? (
							<span className="text-pg-red">{primary.title_gold} </span>
						) : null}
						{isFilled.keyText(primary.title_white) ? (
							<span className="text-pg-ink">{primary.title_white}</span>
						) : null}
					</h2>
				</div>
				{isFilled.richText(primary.description) ? (
					<div className="slice-stack mt-6 overflow-hidden">
						<div className="slice-stack-inner text-lg text-pg-muted [&_a]:text-pg-royal [&_a]:underline">
							<PrismicRichText field={primary.description} />
						</div>
					</div>
				) : null}
				{isFilled.link(primary.contact_link) ? (
					<div className="slice-stack mt-10 overflow-hidden">
						<div className="slice-stack-inner">
							<PrismicLink
								field={primary.contact_link}
								className="inline-flex items-center justify-center gap-2 rounded-md bg-pg-red px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-pg-red/30 transition hover:bg-red-600"
							/>
						</div>
					</div>
				) : null}
			</div>
		</SliceReveal>
	);
}
