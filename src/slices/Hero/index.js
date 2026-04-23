"use client";

import { isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicLink, PrismicRichText } from "@prismicio/react";
import { sectionIdFromKeyText } from "@/lib/section-id";

export default function Hero({ slice, context: _ctx }) {
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
					<div className="absolute inset-0 bg-gradient-to-b from-pg-royal/85 via-pg-ink/88 to-pg-deep/95" />
				</div>
			) : (
				<div className="absolute inset-0 bg-gradient-to-b from-pg-royal via-pg-ink to-pg-deep" />
			)}

			<div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6">
				{isFilled.keyText(primary.eyebrow) ? (
					<p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-pg-anniversary">
						{primary.eyebrow}
					</p>
				) : null}
				<h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
					{isFilled.keyText(primary.title_white) ? (
						<span className="block">{primary.title_white}</span>
					) : null}
					{isFilled.keyText(primary.title_gold) ? (
						<span className="mt-1 block text-pg-red">{primary.title_gold}</span>
					) : null}
				</h1>
				{isFilled.richText(primary.description) ? (
					<div className="max-w-2xl text-base text-white/85 sm:text-lg [&_a]:text-white [&_a]:underline">
						<PrismicRichText field={primary.description} />
					</div>
				) : null}

				<div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
					{isFilled.link(primary.primary_cta) ? (
						<PrismicLink
							field={primary.primary_cta}
							className="inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-md bg-pg-red px-8 py-3 font-display text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-pg-red/35 transition hover:bg-red-600"
						/>
					) : null}
					{isFilled.link(primary.secondary_cta) ? (
						<PrismicLink
							field={primary.secondary_cta}
							className="inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-md border-2 border-white px-8 py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10 hover:ring-2 hover:ring-pg-red/70"
						/>
					) : null}
				</div>
			</div>

			<div
				className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white opacity-85"
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
