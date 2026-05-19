"use client";

import { useRef } from "react";
import { isFilled } from "@prismicio/client";
import type * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicLink, PrismicRichText } from "@prismicio/react";
import type { SliceComponentProps } from "@prismicio/react";
import { sectionIdFromKeyText } from "@/lib/section-id";
import { gsap, useGSAP } from "@/lib/gsap-client";

type HeroProps = SliceComponentProps<prismic.Content.HeroSlice, { lang: string }>;

export default function Hero({ slice, context: _ctx }: HeroProps) {
	const { primary } = slice;
	const anchor = sectionIdFromKeyText(primary.section_id, "hero");
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(() => {
		const section = sectionRef.current;
		if (!section) return;

		const mm = gsap.matchMedia();

		mm.add("(prefers-reduced-motion: no-preference)", () => {
			const bgMedia = section.querySelector(".hero-bg-media");
			const overlay = section.querySelector(".hero-bg-overlay");
			const stacks = section.querySelectorAll(".hero-stack-inner");
			const hint = section.querySelector(".hero-scroll-hint");

			const tl = gsap.timeline({
				defaults: { ease: "power3.out" },
				onComplete: () => {
					if (hint) {
						gsap.to(hint, {
							y: 8,
							duration: 0.85,
							ease: "sine.inOut",
							repeat: -1,
							yoyo: true,
						});
					}
				},
			});

			if (bgMedia) {
				tl.from(bgMedia, { scale: 1.06, opacity: 0, duration: 1.05 }, 0);
			}
			if (overlay) {
				tl.from(overlay, { opacity: 0, duration: 0.55 }, 0.15);
			}
			if (stacks.length) {
				tl.from(
					stacks,
					{
						yPercent: 100,
						opacity: 0,
						duration: 0.72,
						stagger: 0.1,
						ease: "power4.out",
					},
					"-=0.38",
				);
			}
			if (hint) {
				tl.from(
					hint,
					{ opacity: 0, y: 18, duration: 0.48, ease: "power2.out" },
					stacks.length ? "-=0.28" : "+=0.2",
				);
			}

			return () => {
				tl.kill();
				if (hint) {
					gsap.killTweensOf(hint);
				}
			};
		});

		mm.add("(prefers-reduced-motion: reduce)", () => {
			const reset = section.querySelectorAll(
				".hero-bg-media, .hero-bg-overlay, .hero-stack-inner, .hero-scroll-hint",
			);
			gsap.set(reset, {
				opacity: 1,
				scale: 1,
				y: 0,
				yPercent: 0,
				clearProps: "transform",
			});
		});

		return () => mm.revert();
	}, { scope: sectionRef });

	return (
		<section
			ref={sectionRef}
			id={anchor}
			className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-pg-deep px-4 py-28 text-center"
		>
			{isFilled.image(primary.background_image) ? (
				<>
					<div className="hero-bg-media pointer-events-none absolute inset-0 overflow-hidden">
						<PrismicNextImage
							field={primary.background_image}
							fill
							className="object-cover"
							sizes="100vw"
							priority
							loader={null}
						/>
					</div>
					<div className="hero-bg-overlay pointer-events-none absolute inset-0 bg-gradient-to-b from-pg-royal/85 via-pg-ink/88 to-pg-deep/95" />
				</>
			) : (
				<div className="hero-bg-media absolute inset-0 bg-gradient-to-b from-pg-royal via-pg-ink to-pg-deep" />
			)}

			<div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6">
				{isFilled.keyText(primary.eyebrow) ? (
					<div className="hero-stack max-w-full overflow-hidden">
						<p className="hero-stack-inner font-display text-sm font-semibold uppercase tracking-[0.2em] text-pg-anniversary">
							{primary.eyebrow}
						</p>
					</div>
				) : null}

				{(isFilled.keyText(primary.title_white) || isFilled.keyText(primary.title_gold)) ? (
					<h1 className="flex w-full max-w-4xl flex-col items-center gap-1 sm:gap-2 font-display font-extrabold leading-tight tracking-tight">
						{isFilled.keyText(primary.title_white) ? (
							<div className="hero-stack w-full overflow-hidden">
								<span className="hero-stack-inner block text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">
									{primary.title_white}
								</span>
							</div>
						) : null}
						{isFilled.keyText(primary.title_gold) ? (
							<div className="hero-stack w-full overflow-hidden">
								<span className="hero-stack-inner mt-1 block text-4xl text-pg-red sm:text-5xl md:text-6xl lg:text-7xl">
									{primary.title_gold}
								</span>
							</div>
						) : null}
					</h1>
				) : null}

				{isFilled.richText(primary.description) ? (
					<div className="hero-stack max-w-2xl overflow-hidden">
						<div className="hero-stack-inner text-base text-white/85 sm:text-lg [&_a]:text-white [&_a]:underline">
							<PrismicRichText field={primary.description} />
						</div>
					</div>
				) : null}

				{(isFilled.link(primary.primary_cta) || isFilled.link(primary.secondary_cta)) ? (
					<div className="hero-stack mt-4 overflow-hidden">
						<div className="hero-stack-inner flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
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
				) : null}
			</div>

			<div
				className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white opacity-85"
				aria-hidden
			>
				<div className="hero-scroll-hint">
					<svg width="28" height="40" viewBox="0 0 28 40" fill="none">
						<rect x="6" y="6" width="16" height="22" rx="8" stroke="currentColor" strokeWidth="2" />
						<path d="M14 12v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
					</svg>
				</div>
			</div>
		</section>
	);
}
