import type { Migration } from "@prismicio/client";
import type { AllDocumentTypes } from "../../prismicio-types.js";
import type { WpItem } from "../converters/wpTypes.js";
import { isSameSiteUrl, type WpAttachmentRecord } from "./wpAttachments.js";

/** Prismic Image field: empty object, or `{ id: migrationAsset }` during migration. */
export function featuredImageFromThumbnail(
	migration: Migration<AllDocumentTypes>,
	item: WpItem,
	attachmentById: Map<string, WpAttachmentRecord>,
	siteOrigin: string,
): Record<string, unknown> {
	const tid = item.meta["_thumbnail_id"]?.trim();
	if (!tid) return {};
	const att = attachmentById.get(tid);
	if (!att?.url) return {};
	if (!isSameSiteUrl(att.url, siteOrigin)) {
		console.warn(
			`[featured] skip off-site thumb for post ${item.postId}: ${att.url}`,
		);
		return {};
	}
	try {
		const asset = migration.createAsset(att.url, att.filename, {
			alt: att.alt || undefined,
		});
		return { id: asset };
	} catch (err) {
		console.warn(
			`[featured] skip post ${item.postId} thumb ${tid}: ${err instanceof Error ? err.message : err}`,
		);
		return {};
	}
}
