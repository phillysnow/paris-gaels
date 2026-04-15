import { htmlAsRichText } from "@prismicio/migrate";
import type { RichTextField } from "@prismicio/client";
import type { LandingPageDocument } from "../../prismicio-types.js";
import type { WpItem } from "./wpTypes.js";
import { featuredImageFromThumbnail } from "../lib/wpFeaturedImage.js";
import { pllGroupSlug } from "../lib/wxr.js";
import { resolvePrismicLang } from "../lib/lang.js";
import { stripRichTextImagesWithoutMediaId } from "../lib/sanitizeRichTextForMigration.js";
import { buildHomeLandingSlicesFromWp } from "../lib/homeLandingSlicesFromWp.js";
import { textBlockSliceFromRichText } from "../lib/slices.js";
import { wpHtmlToRichTextForMigration } from "../lib/wpRichText.js";
import type { WpConvertContext } from "./wpConvertContext.js";

const SLUG_KIND: Record<string, LandingPageDocument["data"]["page_kind"]> = {
	accueil: "home",
	home: "home",
	entrainements: "training",
	training: "training",
	calendrier: "calendar",
	"club-calendar": "calendar",
	"contact-fr": "contact",
	"contact-en": "contact",
	"plan-du-site": "sitemap",
};

function pageKind(slug: string): LandingPageDocument["data"]["page_kind"] {
	return SLUG_KIND[slug] ?? "other";
}

export type LandingPending = Pick<
	LandingPageDocument,
	"type" | "lang" | "uid" | "data"
>;

export function convertWpPageToLanding(
	item: WpItem,
	ctx?: WpConvertContext,
): {
	pending: LandingPending;
	title: string;
} {
	const html = item.contentHtml?.trim() || "<p></p>";
	let body: RichTextField;
	if (ctx) {
		body = wpHtmlToRichTextForMigration(
			html,
			ctx.migration,
			ctx.siteOrigin,
			`page ${item.postId}`,
		);
	} else {
		const { result: rawBody, warnings } = htmlAsRichText(html, {});
		if (warnings.length) {
			console.warn(`htmlAsRichText [page ${item.postId}]: ${warnings.join("; ")}`);
		}
		body = stripRichTextImagesWithoutMediaId(rawBody);
	}
	const lang = resolvePrismicLang(item);
	const rawSlug = item.postName?.trim() ?? "";
	const uid = rawSlug || `page-${item.postId}`;
	const featured = ctx
		? featuredImageFromThumbnail(
				ctx.migration,
				item,
				ctx.attachmentById,
				ctx.siteOrigin,
			)
		: {};
	const kind = pageKind(rawSlug);
	const homeLang = (lang === "en-gb" ? "en-gb" : "fr-fr") as "fr-fr" | "en-gb";
	const slices = (
		kind === "home" && ctx
			? buildHomeLandingSlicesFromWp({
					lang: homeLang,
					body,
					featuredImage: featured,
				})
			: [textBlockSliceFromRichText(body)]
	) as LandingPending["data"]["slices"];
	const pending: LandingPending = {
		type: "landing_page",
		lang,
		uid,
		data: {
			page_kind: kind,
			featured_image: featured as LandingPending["data"]["featured_image"],
			translation_group_id: pllGroupSlug(item) ?? "",
			slices,
			meta_title: item.title || "",
			meta_description: "",
			meta_image: (Object.keys(featured).length
				? featured
				: {}) as LandingPending["data"]["meta_image"],
		},
	};
	return { pending, title: item.title || uid };
}
