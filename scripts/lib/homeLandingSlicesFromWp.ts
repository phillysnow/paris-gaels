import { randomUUID } from "node:crypto";
import type { RichTextField, RTInlineNode, RTParagraphNode } from "@prismicio/client";
import {
	buildOnePagerSeedSlices,
	rt,
	webLink,
	type LandingSlice,
} from "./onepagerSeedSlices.js";
import { textBlockSliceFromRichText } from "./slices.js";

type HomeLang = "fr-fr" | "en-gb";

/** Hero / StoryStats intro: paragraph + strong, em, hyperlink (no label). */
function isAllowedInlineSpan(sp: RTInlineNode): boolean {
	if (sp.type === "strong" || sp.type === "em") return true;
	if (sp.type === "hyperlink") {
		const d = sp.data;
		if (d.link_type === "Web" && String(d.url ?? "").trim()) return true;
		if (d.link_type === "Document" && String(d.id ?? "").trim()) return true;
		return false;
	}
	return false;
}

/**
 * Keep only `paragraph` blocks and inline spans allowed by home slice StructuredText configs.
 */
function richTextForHomeStructuredText(source: RichTextField): RichTextField {
	const out: RTParagraphNode[] = [];
	for (const node of source) {
		if (node.type !== "paragraph") continue;
		const p = node as RTParagraphNode;
		const spans = (p.spans ?? []).filter(isAllowedInlineSpan);
		const text = p.text ?? "";
		if (!text.trim() && spans.length === 0) continue;
		out.push({
			type: "paragraph",
			text,
			spans,
		});
	}
	return (
		out.length > 0 ? out : [{ type: "paragraph", text: "\u00a0", spans: [] }]
	) as RichTextField;
}

function paragraphBlocks(rt: RichTextField): RichTextField {
	const blocks = rt.filter((b) => b.type === "paragraph");
	return blocks.length > 0
		? (blocks as RichTextField)
		: ([{ type: "paragraph", text: "\u00a0", spans: [] }] as RichTextField);
}

function sliceParagraphs(
	rt: RichTextField,
	start: number,
	count: number,
): RichTextField {
	const p = paragraphBlocks(rt);
	const slice = p.slice(start, start + count) as RichTextField;
	return slice.filter(
		(b) => "text" in b && String((b as { text: string }).text).trim().length > 0,
	) as RichTextField;
}

function hasUsefulText(rt: RichTextField): boolean {
	return rt.some(
		(b) =>
			"text" in b && String((b as { text: string }).text).trim().length > 0,
	);
}

/** TextBlock allows images, but inline WP images often fail Migration API validation; keep copy in Hero / ImageHighlight. */
function richTextForTextBlockBody(source: RichTextField): RichTextField {
	const filtered = source.filter(
		(n) => n.type !== "image" && n.type !== "embed",
	) as RichTextField;
	return filtered.length > 0
		? filtered
		: ([{ type: "paragraph", text: "\u00a0", spans: [] }] as RichTextField);
}

function imageHighlightSlice(args: {
	lang: HomeLang;
	body: RichTextField;
	featuredImage: Record<string, unknown>;
}): LandingSlice {
	const en = args.lang === "en-gb";
	const captionSource = sliceParagraphs(args.body, 4, 1);
	const caption = hasUsefulText(captionSource)
		? richTextForHomeStructuredText(captionSource)
		: rt(
				en
					? "Moments from training and tournaments with Paris Gaels."
					: "Moments d’entraînement et de tournois avec Paris Gaels.",
			);
	const image =
		args.featuredImage && "id" in args.featuredImage && args.featuredImage.id
			? args.featuredImage
			: {};
	return {
		id: `ImageHighlight$${randomUUID()}`,
		slice_type: "ImageHighlight",
		slice_label: null,
		variation: "default",
		version: "initial",
		primary: {
			image: image as never,
			caption,
		},
		items: [],
	} as LandingSlice;
}

function callToActionSlice(lang: HomeLang): LandingSlice {
	const en = lang === "en-gb";
	const calendarUrl = en ? "/en/club-calendar" : "/fr/calendrier";
	const trainingUrl = en ? "/en/training" : "/fr/entrainements";
	return {
		id: `CallToAction$${randomUUID()}`,
		slice_type: "CallToAction",
		slice_label: null,
		variation: "default",
		version: "initial",
		primary: {
			heading: en ? "What’s on" : "À venir",
			description: rt(
				en
					? "Follow the club calendar for fixtures, trainings, and social events."
					: "Suivez le calendrier du club : matchs, entraînements et événements.",
			),
			cta: [
				{ ...webLink(calendarUrl, en ? "Club calendar" : "Calendrier"), key: randomUUID() },
				{
					...webLink(trainingUrl, en ? "Training locations" : "Lieux d’entraînement"),
					key: randomUUID(),
				},
			],
		},
		items: [],
	} as LandingSlice;
}

/**
 * Full `slices/` Shared Slice stack for home (`accueil` / `home`), merged with WordPress:
 * Hero, StoryStats, SportsGrid, TrainingLocations, NewsShowcase, ImageHighlight, CallToAction,
 * JoinBand, TextBlock (full imported body).
 */
export function buildHomeLandingSlicesFromWp(args: {
	lang: HomeLang;
	body: RichTextField;
	featuredImage: Record<string, unknown>;
}): LandingSlice[] {
	const slices = buildOnePagerSeedSlices(args.lang);

	for (const s of slices) {
		if (s.slice_type !== "Hero") continue;
		const heroParas = richTextForHomeStructuredText(
			sliceParagraphs(args.body, 0, 2),
		);
		if (hasUsefulText(heroParas)) {
			s.primary.description = heroParas;
		}
		if (
			args.featuredImage &&
			"id" in args.featuredImage &&
			args.featuredImage.id
		) {
			s.primary.background_image =
				args.featuredImage as (typeof s.primary)["background_image"];
		}
		break;
	}

	for (const s of slices) {
		if (s.slice_type !== "StoryStats") continue;
		const introParas = richTextForHomeStructuredText(
			sliceParagraphs(args.body, 2, 3),
		);
		if (hasUsefulText(introParas)) {
			s.primary.intro = introParas;
		}
		break;
	}

	const joinIdx = slices.findIndex((s) => s.slice_type === "JoinBand");
	const extra: LandingSlice[] = [
		imageHighlightSlice({
			lang: args.lang,
			body: args.body,
			featuredImage: args.featuredImage,
		}),
		callToActionSlice(args.lang),
	];
	if (joinIdx >= 0) slices.splice(joinIdx, 0, ...extra);
	else slices.push(...extra);

	slices.push(textBlockSliceFromRichText(richTextForTextBlockBody(args.body)));

	return slices;
}
