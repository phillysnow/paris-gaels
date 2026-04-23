import { isFilled } from "@prismicio/client";
import { PrismicLink, PrismicRichText } from "@prismicio/react";
import { sectionIdFromKeyText } from "@/lib/section-id";
import { sliceSectionSurfaceClass } from "@/lib/sliceSurface";

export default function JoinBand({ slice, context: _ctx, index, slices }) {
	const { primary } = slice;
	const anchor = sectionIdFromKeyText(primary.section_id, "join");
	const surface = sliceSectionSurfaceClass(slice.slice_type, index, slices);

	return (
		<section id={anchor} className={`px-4 py-20 text-center sm:py-28 ${surface}`}>
			<div className="mx-auto max-w-3xl">
				{isFilled.keyText(primary.eyebrow) ? (
					<p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-pg-red">
						{primary.eyebrow}
					</p>
				) : null}
				<h2 className="mt-3 font-display text-3xl font-bold text-pg-ink sm:text-4xl md:text-5xl">
					{isFilled.keyText(primary.title_gold) ? (
						<span className="text-pg-red">{primary.title_gold} </span>
					) : null}
					{isFilled.keyText(primary.title_white) ? (
						<span className="text-pg-ink">{primary.title_white}</span>
					) : null}
				</h2>
				{isFilled.richText(primary.description) ? (
					<div className="mt-6 text-lg text-pg-muted [&_a]:text-pg-royal [&_a]:underline">
						<PrismicRichText field={primary.description} />
					</div>
				) : null}
				{isFilled.link(primary.contact_link) ? (
					<div className="mt-10">
						<PrismicLink
							field={primary.contact_link}
							className="inline-flex items-center justify-center gap-2 rounded-md bg-pg-red px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-pg-red/30 transition hover:bg-red-600"
						/>
					</div>
				) : null}
			</div>
		</section>
	);
}
