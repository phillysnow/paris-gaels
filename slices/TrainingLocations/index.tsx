import { isFilled } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";
import type { ReactNode } from "react";
import type { TrainingLocationsSlice } from "@/prismicio-types";
import { sectionIdFromKeyText } from "@/lib/section-id";
import type { SliceZoneContext } from "@/slices/slice-context";

function Row({ icon, children }: { icon: "pin" | "train" | "clock"; children: ReactNode }) {
	const cls = "mt-4 flex gap-3 text-left text-sm text-pg-ink";
	const gold = "mt-0.5 h-5 w-5 shrink-0 text-pg-gold";
	if (icon === "pin") {
		return (
			<div className={cls}>
				<svg className={gold} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
					<path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
					<circle cx="12" cy="10" r="2.5" />
				</svg>
				<div>{children}</div>
			</div>
		);
	}
	if (icon === "train") {
		return (
			<div className={cls}>
				<svg className={gold} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
					<rect x="4" y="4" width="16" height="12" rx="2" />
					<path d="M4 16h16M8 20h8" />
				</svg>
				<div>{children}</div>
			</div>
		);
	}
	return (
		<div className={cls}>
			<svg className={gold} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<circle cx="12" cy="12" r="9" />
				<path d="M12 7v5l3 3" strokeLinecap="round" />
			</svg>
			<div>{children}</div>
		</div>
	);
}

export default function TrainingLocations({
	slice,
	context: _ctx,
}: SliceComponentProps<TrainingLocationsSlice, SliceZoneContext>) {
	const { primary, items } = slice;
	const anchor = sectionIdFromKeyText(primary.section_id, "training");

	return (
		<section id={anchor} className="bg-pg-navy px-4 py-20 sm:py-28">
			<div className="mx-auto max-w-content text-center">
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
				{isFilled.richText(primary.intro) ? (
					<div className="mx-auto mt-6 max-w-2xl text-pg-muted">
						<PrismicRichText field={primary.intro} />
					</div>
				) : null}
			</div>

			<div className="mx-auto mt-14 grid max-w-content gap-8 md:grid-cols-2">
				{items.map((item, i) => (
					<article
						key={i}
						className="rounded-xl border border-pg-card-border bg-pg-card/90 p-8 text-left shadow-lg"
					>
						{isFilled.keyText(item.venue_name) ? (
							<h3 className="font-display text-2xl font-bold text-white">{item.venue_name}</h3>
						) : null}
						{isFilled.keyText(item.sports_line) ? (
							<p className="mt-2 font-display text-sm font-semibold text-pg-gold">{item.sports_line}</p>
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
					</article>
				))}
			</div>
		</section>
	);
}
