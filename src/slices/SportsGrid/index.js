import { isFilled } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { sectionIdFromKeyText } from "@/lib/section-id";
import { sliceSectionSurfaceClass } from "@/lib/sliceSurface";

const accentBar = {
	blue: "bg-pg-royal",
	gold: "bg-pg-red",
	green: "bg-pg-green",
};

export default function SportsGrid({ slice, context: _ctx, index, slices }) {
	const { primary, items } = slice;
	const anchor = sectionIdFromKeyText(primary.section_id, "sports");
	const surface = sliceSectionSurfaceClass(slice.slice_type, index, slices);

	return (
		<section id={anchor} className={`px-4 py-20 sm:py-28 ${surface}`}>
			<div className="mx-auto max-w-content text-center">
				{isFilled.keyText(primary.eyebrow) ? (
					<p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-pg-red">
						{primary.eyebrow}
					</p>
				) : null}
				<h2 className="mt-3 font-display text-3xl font-bold text-pg-ink sm:text-4xl md:text-5xl">
					{isFilled.keyText(primary.title_white) ? (
						<span className="text-pg-ink">{primary.title_white} </span>
					) : null}
					{isFilled.keyText(primary.title_gold) ? (
						<span className="text-pg-red">{primary.title_gold}</span>
					) : null}
				</h2>
			</div>

			<div className="mx-auto mt-14 grid max-w-content gap-6 md:grid-cols-2">
				{items.map((item, i) => {
					const bar = accentBar[item.accent ?? "gold"] ?? accentBar.gold;
					return (
						<article
							key={i}
							className="relative overflow-hidden rounded-xl border border-pg-card-border bg-pg-card text-left shadow-sm shadow-black/5"
						>
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
					);
				})}
			</div>
		</section>
	);
}
