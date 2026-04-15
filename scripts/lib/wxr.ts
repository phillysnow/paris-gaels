import { readFileSync } from "node:fs";
import { XMLParser } from "fast-xml-parser";
import type { WpCategoryTag, WpItem } from "../converters/wpTypes.js";

function text(val: unknown): string {
	if (val == null) return "";
	if (typeof val === "string" || typeof val === "number") return String(val);
	if (typeof val === "object" && val !== null && "#text" in val) {
		return String((val as { "#text": unknown })["#text"]);
	}
	return String(val);
}

function normList<T>(v: T | T[] | undefined): T[] {
	if (v == null) return [];
	return Array.isArray(v) ? v : [v];
}

function parseCategories(raw: unknown): WpCategoryTag[] {
	return normList(raw as unknown[] | undefined).map((c) => {
		const o = c as Record<string, unknown>;
		const domain = String(o["@_domain"] ?? o.domain ?? "");
		const nicename = String(o["@_nicename"] ?? o.nicename ?? "");
		return { domain, nicename, label: text(o) };
	});
}

function parsePostmeta(metaBlock: unknown): Record<string, string> {
	const out: Record<string, string> = {};
	for (const row of normList(metaBlock as unknown[] | undefined)) {
		const o = row as Record<string, unknown>;
		const key = text(o["wp:meta_key"] ?? o.meta_key);
		const val = text(o["wp:meta_value"] ?? o.meta_value);
		if (key) out[key] = val;
	}
	return out;
}

function itemFromRaw(raw: Record<string, unknown>): WpItem {
	const meta = parsePostmeta(raw["wp:postmeta"]);
	const categories = parseCategories(raw.category);
	const attachmentUrl = text(raw["wp:attachment_url"] ?? raw.attachment_url);
	return {
		postId: text(raw["wp:post_id"] ?? raw.post_id),
		postType: text(raw["wp:post_type"] ?? raw.post_type),
		status: text(raw["wp:status"] ?? raw.status),
		postName: text(raw["wp:post_name"] ?? raw.post_name),
		title: text(raw.title),
		pubDate: text(raw.pubDate),
		link: text(raw.link),
		contentHtml: text(raw["content:encoded"] ?? raw.content_encoded),
		excerptHtml: text(raw["excerpt:encoded"] ?? raw.excerpt_encoded),
		postDateGmt: text(raw["wp:post_date_gmt"] ?? raw.post_date_gmt),
		categories,
		meta,
		...(attachmentUrl ? { attachmentUrl } : {}),
	};
}

export type WpChannel = {
	title: string;
	description: string;
	link: string;
};

export function loadChannel(wxrPath: string): WpChannel {
	const xml = readFileSync(wxrPath, "utf8");
	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "@_",
		textNodeName: "#text",
		isArray: (name) => name === "item",
	});
	const doc = parser.parse(xml) as Record<string, unknown>;
	const rss = doc.rss as Record<string, unknown> | undefined;
	const channel = (rss?.channel ?? doc.channel) as Record<string, unknown> | undefined;
	if (!channel) throw new Error("Invalid WXR: missing channel");
	return {
		title: text(channel.title),
		description: text(channel.description),
		link: text(channel.link),
	};
}

export function loadWxItems(wxrPath: string): WpItem[] {
	const xml = readFileSync(wxrPath, "utf8");
	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "@_",
		textNodeName: "#text",
		isArray: (name) =>
			name === "item" ||
			name === "category" ||
			name === "wp:postmeta" ||
			name === "wp:comment",
	});
	const doc = parser.parse(xml) as Record<string, unknown>;
	const rss = doc.rss as Record<string, unknown> | undefined;
	const channel = (rss?.channel ?? doc.channel) as Record<string, unknown> | undefined;
	if (!channel?.item) throw new Error("Invalid WXR: missing channel.item");
	const items = normList(channel.item as unknown[]);
	return items.map((i) => itemFromRaw(i as Record<string, unknown>));
}

export function wpLangNicename(item: WpItem): "fr" | "en" | undefined {
	const lang = item.categories.find((c) => c.domain === "language")?.nicename;
	if (lang === "fr" || lang === "en") return lang;
	return undefined;
}

export function pllGroupSlug(item: WpItem): string | undefined {
	return item.categories.find((c) => c.domain === "post_translations")?.nicename;
}

export function wpDocumentTags(item: WpItem): string[] {
	const tags = new Set<string>();
	for (const c of item.categories) {
		if (c.domain === "category" || c.domain === "post_tag") {
			if (c.nicename) tags.add(c.nicename);
		}
	}
	return [...tags];
}
