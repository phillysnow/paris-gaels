import { isFilled } from "@prismicio/client";
import type * as prismic from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";
import { SliceReveal } from "@/components/SliceReveal";
import { sectionIdFromKeyText } from "@/lib/section-id";
import { sliceSectionSurfaceClass } from "@/lib/sliceSurface";

type SportsGridProps = SliceComponentProps<prismic.Content.SportsGridSlice, { lang: string }>;

const accentBar: Record<string, string> = {
	blue: "bg-pg-royal",
	red: "bg-pg-red",
};

export default function SportsGrid({ slice, context: _ctx, index, slices }: SportsGridProps) {
	const { primary, items } = slice;
	const anchor = sectionIdFromKeyText(primary.section_id, "sports");
	const surface = sliceSectionSurfaceClass(slice.slice_type, index, slices);

	return (
		<SliceReveal id={anchor} className={`px-4 py-20 sm:py-28 ${surface}`}>
			<div className="mx-auto max-w-content text-center">
				{isFilled.keyText(primary.eyebrow) ? (
					<div className="slice-stack overflow-hidden">
						<p className="slice-stack-inner font-display text-sm font-semibold uppercase tracking-[0.2em] text-pg-red">
							{primary.eyebrow}
						</p>
					</div>
				) : null}
				<div className="slice-stack mt-3 overflow-hidden">
					<h2 className="slice-stack-inner font-display text-3xl font-bold text-pg-ink sm:text-4xl md:text-5xl">
						{isFilled.keyText(primary.title_white) ? (
							<span className="text-pg-ink">{primary.title_white} </span>
						) : null}
						{isFilled.keyText(primary.title_gold) ? (
							<span className="text-pg-red">{primary.title_gold}</span>
						) : null}
					</h2>
				</div>
			</div>

			<div className="slice-items mx-auto mt-14 grid max-w-content gap-6 md:grid-cols-2">
				{items.map((item, i) => {
					const bar = accentBar[item.accent ?? "red"] ?? accentBar.red;
					return (
						<div key={i} className="slice-stack overflow-hidden rounded-xl">
							<article className="slice-stack-inner relative overflow-hidden rounded-xl border border-pg-card-border bg-pg-card text-left shadow-sm shadow-black/5">
								<div className={`absolute left-0 top-0 h-full w-1.5 ${bar}`} />
								<div className="p-6 pl-8">
									<div className="mb-3 flex items-start justify-between gap-3">
										{isFilled.keyText(item.sport_name) ? (
											<h3 className="font-display text-xl font-bold text-pg-ink">{item.sport_name}</h3>
										) : null}
										{isFilled.keyText(item.category_badge) ? (
											<span className="shrink-0 rounded bg-pg-surface-blue px-2.5 py-1 text-xs font-medium text-pg-ink ring-1 ring-pg-card-border">
												{item.category_badge}
											</span>
										) : null}
									</div>
									{isFilled.richText(item.description) ? (
										<div className="text-sm leading-relaxed text-pg-muted [&_p]:mb-2 [&_p:last-child]:mb-0">
											<PrismicRichText field={item.description} />
										</div>
									) : null}
								</div>
							</article>
						</div>
					);
				})}
			</div>
		</SliceReveal>
	);
}
