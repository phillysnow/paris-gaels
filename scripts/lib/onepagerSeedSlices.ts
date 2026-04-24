import { randomUUID } from "node:crypto";
import type { RichTextField } from "@prismicio/client";
import type { LandingPageDocument } from "../../prismicio-types.js";

export type LandingSlice = LandingPageDocument["data"]["slices"][number];

/** Single paragraph rich text (e.g. slice defaults). */
export function rt(text: string): RichTextField {
	return [{ type: "paragraph", text, spans: [] }] as RichTextField;
}

export function webLink(url: string, linkText: string) {
	return {
		link_type: "Web" as const,
		url,
		text: linkText,
		target: undefined,
	};
}

/** Prepends a default one-pager stack (placeholders). Push slice models to Prismic before running. */
export function buildOnePagerSeedSlices(lang: "fr-fr" | "en-gb"): LandingSlice[] {
	const en = lang === "en-gb";
	const base = en ? "/en" : "/fr";

	const hero: LandingSlice = {
		id: `Hero$${randomUUID()}`,
		slice_type: "Hero",
		slice_label: null,
		variation: "default",
		version: "initial",
		primary: {
			eyebrow: en ? "EST. 1995 — PARIS, FRANCE" : "FONDÉ EN 1995 — PARIS, FRANCE",
			title_white: "PARIS GAELS",
			title_gold: "GAA",
			description: rt(
				en
					? "The first GAA club in Continental Europe. Gaelic football, hurling, camogie & handball in Paris."
					: "Le premier club GAA d’Europe continentale. Football gaélique, hurling, camogie et handball au cœur de Paris.",
			),
			background_image: {},
			primary_cta: webLink(`${base}#sports`, en ? "Discover our sports" : "Découvrir nos sports"),
			secondary_cta: webLink(`${base}#join`, en ? "Join the club" : "Rejoindre le club"),
			section_id: "hero",
		},
		items: [],
	} as LandingSlice;

	const story: LandingSlice = {
		id: `StoryStats$${randomUUID()}`,
		slice_type: "StoryStats",
		slice_label: null,
		variation: "default",
		version: "initial",
		primary: {
			eyebrow: en ? "OUR STORY" : "NOTRE HISTOIRE",
			title_lead: en ? "Gaelic sports in the " : "Les sports gaéliques au ",
			title_highlight: en ? "heart of Paris" : "cœur de Paris",
			intro: rt(
				en
					? "Founded in 1995, Paris Gaels welcomes beginners and experienced players alike."
					: "Fondé en 1995, Paris Gaels accueille débutants et joueurs confirmés.",
			),
			section_id: "about",
		},
		items: [
			{
				icon: "calendar",
				stat_value: "1995",
				stat_label: en ? "Founded" : "Fondation",
			},
			{
				icon: "globe",
				stat_value: en ? "Continental" : "Continental",
				stat_label: en ? "First in Europe" : "Premier en Europe",
			},
			{
				icon: "users",
				stat_value: "5.2K+",
				stat_label: en ? "Community" : "Communauté",
			},
			{
				icon: "trophy",
				stat_value: en ? "Multiple" : "Plusieurs",
				stat_label: en ? "Championships" : "Titres",
			},
		],
	} as LandingSlice;

	const sports: LandingSlice = {
		id: `SportsGrid$${randomUUID()}`,
		slice_type: "SportsGrid",
		slice_label: null,
		variation: "default",
		version: "initial",
		primary: {
			eyebrow: en ? "WHAT WE PLAY" : "CE QUE NOUS PRATIQUONS",
			title_white: en ? "Our " : "Nos ",
			title_gold: en ? "Sports" : "Sports",
			section_id: "sports",
		},
		items: [
			{
				sport_name: "Gaelic Football",
				description: rt(en ? "Fast field game with goals and points." : "Jeu de terrain rapide avec buts et points."),
				category_badge: en ? "Ladies & Men" : "Dames & Hommes",
				accent: "blue",
			},
			{
				sport_name: "Hurling",
				description: rt(en ? "Stick and ball tradition." : "Tradition bâton et balle."),
				category_badge: "Men",
				accent: "gold",
			},
		],
	} as LandingSlice;

	const training: LandingSlice = {
		id: `TrainingLocations$${randomUUID()}`,
		slice_type: "TrainingLocations",
		slice_label: null,
		variation: "default",
		version: "initial",
		primary: {
			eyebrow: en ? "WHERE & WHEN" : "OÙ & QUAND",
			title_gold: en ? "Training " : "Entraînements ",
			title_white: en ? "Locations" : "Lieux",
			intro: rt(
				en ? "New players are always welcome — come try a session."
					: "Les nouveaux joueurs sont toujours les bienvenus.",
			),
			section_id: "training",
		},
		items: [
			{
				venue_name: "Stade Pershing",
				sports_line: en ? "Gaelic Football / Hurling / Camogie" : "Football gaélique / Hurling / Camogie",
				address: "Porte d’Auteuil, Paris",
				transport: "Métro / RER",
				schedule: en ? "See club calendar" : "Voir le calendrier du club",
			},
		],
	} as LandingSlice;

	const news: LandingSlice = {
		id: `NewsShowcase$${randomUUID()}`,
		slice_type: "NewsShowcase",
		slice_label: null,
		variation: "default",
		version: "initial",
		primary: {
			// Omit `feed`: older Prismic slice models reject unknown primary fields during migration.
			eyebrow: en ? "LATEST UPDATES" : "DERNIÈRES NOUVELLES",
			title_white: en ? "Club " : "Actus ",
			title_gold: en ? "News" : "club",
			section_id: "news",
			view_all_label: en ? "View all news" : "Toutes les actualités",
		},
		items: [],
	} as unknown as LandingSlice;

	const join: LandingSlice = {
		id: `JoinBand$${randomUUID()}`,
		slice_type: "JoinBand",
		slice_label: null,
		variation: "default",
		version: "initial",
		primary: {
			eyebrow: en ? "GET INVOLVED" : "PARTICIPER",
			title_gold: en ? "Join " : "Rejoignez ",
			title_white: en ? "Paris Gaels" : "Paris Gaels",
			description: rt(
				en
					? "Everyone is welcome — beginners or seasoned players."
					: "Tout le monde est le bienvenu — débutants ou joueurs confirmés.",
			),
			contact_link: webLink(
				"mailto:secretary.paris.europe@gaa.ie",
				"secretary.paris.europe@gaa.ie",
			),
			section_id: "join",
		},
		items: [],
	} as LandingSlice;

	return [hero, story, sports, training, news, join];
}
