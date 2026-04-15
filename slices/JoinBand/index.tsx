import { isFilled } from "@prismicio/client";
import { PrismicLink, PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";
import type { JoinBandSlice } from "@/prismicio-types";
import { sectionIdFromKeyText } from "@/lib/section-id";
import type { SliceZoneContext } from "@/slices/slice-context";

export default function JoinBand({
	slice,
	context: _ctx,
}: SliceComponentProps<JoinBandSlice, SliceZoneContext>) {
	const { primary } = slice;
	const anchor = sectionIdFromKeyText(primary.section_id, "join");

	return (
		<section
			id={anchor}
			className="bg-pg-navy px-4 py-20 text-center sm:py-28"
		>
			<div className="mx-auto max-w-3xl">
				{isFilled.keyText(primary.eyebrow) ? (
					<p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-pg-gold">
						{primary.eyebrow}
					</p>
				) : null}
				<h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
					{isFilled.keyText(primary.title_gold) ? (
						<span className="text-pg-gold-bright">{primary.title_gold} </span>
					) : null}
					{isFilled.keyText(primary.title_white) ? (
						<span className="text-white">{primary.title_white}</span>
					) : null}
				</h2>
				{isFilled.richText(primary.description) ? (
					<div className="mt-6 text-lg text-pg-ink [&_a]:text-pg-gold-bright [&_a]:underline">
						<PrismicRichText field={primary.description} />
					</div>
				) : null}
				{isFilled.link(primary.contact_link) ? (
					<div className="mt-10">
						<PrismicLink
							field={primary.contact_link}
							className="inline-flex items-center justify-center gap-2 rounded-md bg-pg-gold-bright px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-pg-deep shadow-lg shadow-pg-gold/30 transition hover:bg-pg-gold"
						/>
					</div>
				) : null}
			</div>
		</section>
	);
}
