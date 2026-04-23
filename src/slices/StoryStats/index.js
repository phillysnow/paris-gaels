import { isFilled } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { sectionIdFromKeyText } from "@/lib/section-id";
import { sliceSectionSurfaceClass } from "@/lib/sliceSurface";

function StatIcon({ name }) {
	const cls = "h-8 w-8 text-pg-red";
	switch (name) {
		case "globe":
			return (
				<svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
					<circle cx="12" cy="12" r="10" />
					<path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
				</svg>
			);
		case "users":
			return (
				<svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
			);
		case "trophy":
			return (
				<svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
					<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14v8M14 14v8M8 6h8v5a4 4 0 0 1-8 0V6z" />
				</svg>
			);
		case "calendar":
		default:
			return (
				<svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
					<rect x="3" y="4" width="18" height="18" rx="2" />
					<path d="M16 2v4M8 2v4M3 10h18" />
				</svg>
			);
	}
}

export default function StoryStats({ slice, context: _ctx, index, slices }) {
	const { primary, items } = slice;
	const anchor = sectionIdFromKeyText(primary.section_id, "about");
	const surface = sliceSectionSurfaceClass(slice.slice_type, index, slices);

	return (
		<section id={anchor} className={`px-4 py-20 text-center sm:py-28 ${surface}`}>
			<div className="mx-auto max-w-content">
				{isFilled.keyText(primary.eyebrow) ? (
					<p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-pg-red">
						{primary.eyebrow}
					</p>
				) : null}
				<h2 className="mt-3 font-display text-3xl font-bold text-pg-ink sm:text-4xl md:text-5xl">
					{isFilled.keyText(primary.title_lead) ? (
						<span className="block sm:inline">{primary.title_lead} </span>
					) : null}
					{isFilled.keyText(primary.title_highlight) ? (
						<span className="text-pg-red">{primary.title_highlight}</span>
					) : null}
				</h2>
				{isFilled.richText(primary.intro) ? (
					<div className="mx-auto mt-6 max-w-3xl text-pg-muted [&_a]:text-pg-royal [&_a]:underline">
						<PrismicRichText field={primary.intro} />
					</div>
				) : null}

				{items.length > 0 ? (
					<ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{items.map((item, i) => (
							<li
								key={i}
								className="rounded-xl border border-pg-card-border bg-pg-card px-5 py-8 shadow-sm shadow-black/5"
							>
								<div className="mb-4 flex justify-center">
									<StatIcon name={item.icon} />
								</div>
								{isFilled.keyText(item.stat_value) ? (
									<p className="font-display text-3xl font-bold text-pg-ink">{item.stat_value}</p>
								) : null}
								{isFilled.keyText(item.stat_label) ? (
									<p className="mt-2 text-sm text-pg-muted">{item.stat_label}</p>
								) : null}
							</li>
						))}
					</ul>
				) : null}
			</div>
		</section>
	);
}
