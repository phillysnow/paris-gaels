import { isFilled } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";
import type { SportsGridSlice } from "@/prismicio-types";
import { sectionIdFromKeyText } from "@/lib/section-id";
import type { SliceZoneContext } from "@/slices/slice-context";

const accentBar: Record<string, string> = {
	blue: "bg-pg-blue",
	gold: "bg-pg-gold-bright",
	green: "bg-pg-green",
};

export default function SportsGrid({
	slice,
	context: _ctx,
}: SliceComponentProps<SportsGridSlice, SliceZoneContext>) {
	const { primary, items } = slice;
	const anchor = sectionIdFromKeyText(primary.section_id, "sports");

	return (
		<section id={anchor} className="bg-pg-deep px-4 py-20 sm:py-28">
			<div className="mx-auto max-w-content text-center">
				{isFilled.keyText(primary.eyebrow) ? (
					<p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-pg-gold">
						{primary.eyebrow}
					</p>
				) : null}
				<h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
					{isFilled.keyText(primary.title_white) ? (
						<span className="text-white">{primary.title_white} </span>
					) : null}
					{isFilled.keyText(primary.title_gold) ? (
						<span className="text-pg-gold-bright">{primary.title_gold}</span>
					) : null}
				</h2>
			</div>

			<div className="mx-auto mt-14 grid max-w-content gap-6 md:grid-cols-2">
				{items.map((item, i) => {
					const bar =
						accentBar[item.accent ?? "gold"] ?? accentBar.gold;
					return (
						<article
							key={i}
							className="relative overflow-hidden rounded-xl border border-pg-card-border bg-pg-card/90 text-left shadow-lg"
						>
							<div className={`absolute left-0 top-0 h-full w-1.5 ${bar}`} />
							<div className="p-6 pl-8">
								<div className="mb-3 flex items-start justify-between gap-3">
									{isFilled.keyText(item.sport_name) ? (
										<h3 className="font-display text-xl font-bold text-white">{item.sport_name}</h3>
									) : null}
									{isFilled.keyText(item.category_badge) ? (
										<span className="shrink-0 rounded bg-black/40 px-2.5 py-1 text-xs font-medium text-pg-muted">
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
