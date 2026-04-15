import { htmlAsRichText } from "@prismicio/migrate";
import type { RichTextField } from "@prismicio/client";
import type { ArticleDocument } from "../../prismicio-types.js";
import type { WpItem } from "./wpTypes.js";
import type { WpConvertContext } from "./wpConvertContext.js";
import { featuredImageFromThumbnail } from "../lib/wpFeaturedImage.js";
import { pllGroupSlug, wpDocumentTags } from "../lib/wxr.js";
import { resolvePrismicLang } from "../lib/lang.js";
import { stripRichTextImagesWithoutMediaId } from "../lib/sanitizeRichTextForMigration.js";
import { textBlockSliceFromRichText } from "../lib/slices.js";
import { wpHtmlToRichTextForMigration } from "../lib/wpRichText.js";

/** Prismic TimestampField expects `YYYY-MM-DDTHH:MM:SS+0000` (no ms, `+0000` offset). */
function publicationTimestamp(item: WpItem): string {
	const toPrismicUtc = (d: Date): string => {
		const iso = d.toISOString();
		const base = iso.includes(".") ? iso.slice(0, iso.indexOf(".")) : iso.replace("Z", "");
		return `${base}+0000`;
	};
	const gmt = item.postDateGmt?.trim();
	if (gmt && !gmt.startsWith("0000")) {
		const d = new Date(gmt.replace(" ", "T") + "Z");
		if (!Number.isNaN(d.getTime())) return toPrismicUtc(d);
	}
	const pd = Date.parse(item.pubDate);
	if (!Number.isNaN(pd)) return toPrismicUtc(new Date(pd));
	return toPrismicUtc(new Date());
}

function excerptPlain(item: WpItem): string {
	const ex = item.excerptHtml?.replace(/<[^>]+>/g, "").trim();
	if (ex) return ex.slice(0, 300);
	const b = item.contentHtml?.replace(/<[^>]+>/g, "").trim();
	return b ? b.slice(0, 300) : "";
}

export type ArticlePending = Pick<
	ArticleDocument,
	"type" | "lang" | "uid" | "tags" | "data"
>;

export type { WpConvertContext } from "./wpConvertContext.js";

export function convertWpPostToArticle(
	item: WpItem,
	ctx?: WpConvertContext,
): {
	pending: ArticlePending;
	title: string;
	tags: string[];
} {
	const html = item.contentHtml?.trim() || "<p></p>";
	let body: RichTextField;
	if (ctx) {
		body = wpHtmlToRichTextForMigration(
			html,
			ctx.migration,
			ctx.siteOrigin,
			`post ${item.postId}`,
		);
	} else {
		const { result: rawBody, warnings } = htmlAsRichText(html, {});
		if (warnings.length) {
			console.warn(`htmlAsRichText [post ${item.postId}]: ${warnings.join("; ")}`);
		}
		body = stripRichTextImagesWithoutMediaId(rawBody);
	}
	const lang = resolvePrismicLang(item);
	const rawSlug = item.postName?.trim() ?? "";
	const uid = rawSlug || `p-${item.postId}`;
	const tags = wpDocumentTags(item);
	const featured = ctx
		? featuredImageFromThumbnail(
				ctx.migration,
				item,
				ctx.attachmentById,
				ctx.siteOrigin,
			)
		: {};
	const pending: ArticlePending = {
		type: "article",
		lang,
		uid,
		tags,
		data: {
			publication_date: publicationTimestamp(item),
			featured_image: featured as ArticlePending["data"]["featured_image"],
			excerpt: excerptPlain(item),
			translation_group_id: pllGroupSlug(item) ?? "",
			slices: [textBlockSliceFromRichText(body)],
			meta_title: item.title || "",
			meta_description: excerptPlain(item) || "",
			meta_image: (Object.keys(featured).length
				? featured
				: {}) as ArticlePending["data"]["meta_image"],
		},
	};
	return { pending, title: item.title || uid, tags };
}
