"use client";

import { isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicLink, PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";
import type { HeroSlice } from "@/prismicio-types";
import { sectionIdFromKeyText } from "@/lib/section-id";
import type { SliceZoneContext } from "@/slices/slice-context";

export default function Hero({
	slice,
	context: _ctx,
}: SliceComponentProps<HeroSlice, SliceZoneContext>) {
	const { primary } = slice;
	const anchor = sectionIdFromKeyText(primary.section_id, "hero");

	return (
		<section
			id={anchor}
			className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-pg-deep px-4 py-28 text-center"
		>
			{isFilled.image(primary.background_image) ? (
				<div className="pointer-events-none absolute inset-0">
					<PrismicNextImage
						field={primary.background_image}
						fill
						className="object-cover"
						sizes="100vw"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-pg-midnight/90 via-pg-midnight/75 to-pg-deep/95" />
				</div>
			) : (
				<div className="absolute inset-0 bg-gradient-to-b from-pg-navy to-pg-deep" />
			)}

			<div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6">
				{isFilled.keyText(primary.eyebrow) ? (
					<p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-pg-gold-bright">
						{primary.eyebrow}
					</p>
				) : null}
				<h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
					{isFilled.keyText(primary.title_white) ? (
						<span className="block">{primary.title_white}</span>
					) : null}
					{isFilled.keyText(primary.title_gold) ? (
						<span className="mt-1 block text-pg-gold-bright">{primary.title_gold}</span>
					) : null}
				</h1>
				{isFilled.richText(primary.description) ? (
					<div className="max-w-2xl text-base text-pg-muted sm:text-lg">
						<PrismicRichText field={primary.description} />
					</div>
				) : null}

				<div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
					{isFilled.link(primary.primary_cta) ? (
						<PrismicLink
							field={primary.primary_cta}
							className="inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-md bg-pg-gold-bright px-8 py-3 font-display text-sm font-bold uppercase tracking-wide text-pg-deep shadow-lg shadow-pg-gold/20 transition hover:bg-pg-gold"
						/>
					) : null}
					{isFilled.link(primary.secondary_cta) ? (
						<PrismicLink
							field={primary.secondary_cta}
							className="inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-md border-2 border-white/90 px-8 py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
						/>
					) : null}
				</div>
			</div>

			<div
				className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-pg-gold-bright opacity-80"
				aria-hidden
			>
				<svg width="28" height="40" viewBox="0 0 28 40" fill="none" className="animate-bounce">
					<rect x="6" y="6" width="16" height="22" rx="8" stroke="currentColor" strokeWidth="2" />
					<path d="M14 12v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				</svg>
			</div>
		</section>
	);
}
