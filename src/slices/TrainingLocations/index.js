import { isFilled } from "@prismicio/client";
import { PrismicLink, PrismicRichText } from "@prismicio/react";
import { newsCardClassName } from "@/components/NewsArticleCard";
import { sectionIdFromKeyText } from "@/lib/section-id";
import { sliceSectionSurfaceClass } from "@/lib/sliceSurface";

function Row({ icon, children }) {
	const cls = "mt-4 flex gap-3 text-left text-sm text-pg-muted";
	const accent = "mt-0.5 h-5 w-5 shrink-0 text-pg-red";
	if (icon === "pin") {
		return (
			<div className={cls}>
				<svg className={accent} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
					<path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
					<circle cx="12" cy="10" r="2.5" />
				</svg>
				<div className="text-pg-ink">{children}</div>
			</div>
		);
	}
	if (icon === "train") {
		return (
			<div className={cls}>
				<svg className={accent} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
					<rect x="4" y="4" width="16" height="12" rx="2" />
					<path d="M4 16h16M8 20h8" />
				</svg>
				<div className="text-pg-ink">{children}</div>
			</div>
		);
	}
	return (
		<div className={cls}>
			<svg className={accent} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<circle cx="12" cy="12" r="9" />
				<path d="M12 7v5l3 3" strokeLinecap="round" />
			</svg>
			<div className="text-pg-ink">{children}</div>
		</div>
	);
}

/** Base shell when there is no maps link (same as news cards, without hover). */
const venueCardClassStatic =
	"block overflow-hidden rounded-xl border border-pg-card-border bg-pg-card p-8 text-left shadow-sm shadow-black/5";

export default function TrainingLocations({ slice, context: _ctx, index, slices }) {
	const { primary, items } = slice;
	const anchor = sectionIdFromKeyText(primary.section_id, "training");
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
					{isFilled.keyText(primary.title_gold) ? (
						<span className="text-pg-red">{primary.title_gold} </span>
					) : null}
					{isFilled.keyText(primary.title_white) ? (
						<span className="text-pg-ink">{primary.title_white}</span>
					) : null}
				</h2>
				{isFilled.richText(primary.intro) ? (
					<div className="mx-auto mt-6 max-w-2xl text-pg-muted [&_a]:text-pg-royal [&_a]:underline">
						<PrismicRichText field={primary.intro} />
					</div>
				) : null}
			</div>

			<div className="mx-auto mt-14 grid max-w-content gap-8 md:grid-cols-2">
				{items.map((item, i) => {
					const inner = (
						<>
							{isFilled.keyText(item.venue_name) ? (
								<h3 className="font-display text-2xl font-bold text-pg-ink">{item.venue_name}</h3>
							) : null}
							{isFilled.keyText(item.sports_line) ? (
								<p className="mt-2 font-display text-sm font-semibold text-pg-red">{item.sports_line}</p>
							) : null}
							{isFilled.keyText(item.address) ? (
								<Row icon="pin">
									<p>{item.address}</p>
								</Row>
							) : null}
							{isFilled.keyText(item.transport) ? (
								<Row icon="train">
									<p>{item.transport}</p>
								</Row>
							) : null}
							{isFilled.keyText(item.schedule) ? (
								<Row icon="clock">
									<p>{item.schedule}</p>
								</Row>
							) : null}
						</>
					);
					if (isFilled.link(item.maps_link)) {
						return (
							<PrismicLink key={i} field={item.maps_link} className={`${newsCardClassName} p-8`}>
								{inner}
							</PrismicLink>
						);
					}
					return (
						<article key={i} className={venueCardClassStatic}>
							{inner}
						</article>
					);
				})}
			</div>
		</section>
	);
}
