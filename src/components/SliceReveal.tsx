"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-client";

interface SliceRevealProps {
  as?: React.ElementType;
  id?: string;
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "centered" | "minimal" | "image";
}

let refreshRaf: number;
function scheduleRefresh() {
	cancelAnimationFrame(refreshRaf);
	refreshRaf = requestAnimationFrame(() => ScrollTrigger.refresh());
}

/**
 * Scroll-triggered entrance animation for landing page slices.
 *
 * variant="default"  — clip-up reveal for headings, float for grid item cards
 * variant="centered" — scale-fade for CTA / join sections (no clip)
 * variant="minimal"  — opacity-only fade for prose / text-block sections
 *
 * Slices that have card grids should add the `slice-items` class to their grid
 * container so SliceReveal can animate headings and cards as separate groups.
 */
export function SliceReveal({
	as: Comp = "section",
	id,
	className,
	children,
	variant = "default",
}: SliceRevealProps) {
	const ref = useRef<HTMLElement>(null);

	useGSAP(() => {
		const section = ref.current;
		if (!section) return;

		const mm = gsap.matchMedia();

		mm.add("(prefers-reduced-motion: no-preference)", () => {
			const media = section.querySelectorAll(".slice-reveal-media");
			const allStackInners = [...section.querySelectorAll(".slice-stack-inner")];
			// Heading / body text: stack-inners NOT inside a .slice-items container
			const headingStacks = allStackInners.filter((el) => !el.closest(".slice-items"));
			// Card wrappers: direct .slice-stack children of .slice-items (the outer card shell)
			const itemWrappers = section.querySelectorAll(".slice-items > .slice-stack");

			if (!media.length && !allStackInners.length) return undefined;

			const tl = gsap.timeline({
				defaults: { ease: "power3.out" },
				scrollTrigger: {
					trigger: section,
					start: "top bottom-=12%",
					toggleActions: "play none none none",
					invalidateOnRefresh: true,
				},
			});

			// Media reveal — shared across all variants
			if (media.length) {
				tl.from(
					media,
					{
						scale: 1.06,
						opacity: 0,
						duration: 0.9,
						stagger: 0.07,
						ease: "power2.out",
						immediateRender: false,
					},
					0,
				);
			}

			const afterMedia = media.length ? "-=0.5" : 0;

			if (variant === "minimal") {
				// Prose: soft opacity fade only — no movement to distract from reading
				if (allStackInners.length) {
					tl.from(
						allStackInners,
						{
							opacity: 0,
							duration: 0.75,
							stagger: 0.04,
							ease: "power1.inOut",
							immediateRender: false,
						},
						afterMedia,
					);
				}
			} else if (variant === "centered") {
				// CTA / join sections: elements emerge as a cohesive group via scale-fade.
				// No clip effect — the organic scale feels warmer for conversion-focused sections.
				if (allStackInners.length) {
					tl.from(
						allStackInners,
						{
							opacity: 0,
							scale: 0.94,
							duration: 0.68,
							stagger: 0.07,
							ease: "power3.out",
							immediateRender: false,
						},
						afterMedia,
					);
				}
			} else {
				// "default": sharp clip-up for headings, then cards float up as a cascade
				if (headingStacks.length) {
					tl.from(
						headingStacks,
						{
							yPercent: 100,
							opacity: 0,
							duration: 0.62,
							stagger: 0.05,
							ease: "power4.out",
							immediateRender: false,
						},
						afterMedia,
					);
				}

				// Cards float up after headings are ~halfway done
				if (itemWrappers.length) {
					tl.from(
						itemWrappers,
						{
							y: 36,
							opacity: 0,
							duration: 0.58,
							stagger: 0.08,
							ease: "power2.out",
							immediateRender: false,
						},
						headingStacks.length ? "-=0.28" : afterMedia,
					);
				}
			}

			scheduleRefresh();
			return () => { tl.kill(); };
		});

		mm.add("(prefers-reduced-motion: reduce)", () => {
			gsap.set(
				section.querySelectorAll(
					".slice-reveal-media, .slice-stack-inner, .slice-items > .slice-stack",
				),
				{
					opacity: 1,
					scale: 1,
					y: 0,
					yPercent: 0,
					clearProps: "transform",
				},
			);
		});

		return () => mm.revert();
	}, { scope: ref });

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const El = Comp as React.ComponentType<any>;
	return (
		<El ref={ref} id={id} className={className}>
			{children}
		</El>
	);
}
