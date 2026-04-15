import { htmlAsRichText } from "@prismicio/migrate";
import type { RichTextHTMLMapSerializer } from "@prismicio/migrate";
import type { Migration, RTNode } from "@prismicio/client";
import { RichTextNodeType } from "@prismicio/client";
import type { AllDocumentTypes } from "../../prismicio-types.js";
import { isSameSiteUrl } from "./wpAttachments.js";

function safeFilenameFromUrl(absUrl: string): string {
	const base = absUrl.split("/").pop() ?? "image";
	return base.split("?")[0] || "image.bin";
}

/**
 * HTML → Prismic Rich Text with `<img>` mapped to `migration.createAsset(url)` so the Migration API
 * uploads media and wires RT image nodes correctly.
 */
export function buildImgSerializer(
	migration: Migration<AllDocumentTypes>,
	siteOrigin: string,
): RichTextHTMLMapSerializer {
	return {
		img: ({ node }) => {
			const srcRaw = node.properties?.src;
			if (typeof srcRaw !== "string" || !srcRaw.trim()) return undefined;
			if (srcRaw.trim().startsWith("data:")) return undefined;
			let abs: string;
			try {
				abs = new URL(srcRaw.trim(), siteOrigin).href;
			} catch {
				return undefined;
			}
			if (!isSameSiteUrl(abs, siteOrigin)) {
				console.warn(`[img→asset] skip off-site: ${abs}`);
				return undefined;
			}
			const filename = safeFilenameFromUrl(abs);
			const altRaw = node.properties?.alt;
			const alt =
				typeof altRaw === "string" && altRaw.trim() ? altRaw.trim() : undefined;
			try {
				const asset = migration.createAsset(abs, filename, { alt });
				return {
					type: RichTextNodeType.image,
					id: asset,
				} as unknown as RTNode;
			} catch (err) {
				console.warn(
					`[img→asset] skipped ${abs}: ${err instanceof Error ? err.message : err}`,
				);
				return undefined;
			}
		},
	};
}

export function wpHtmlToRichTextForMigration(
	html: string,
	migration: Migration<AllDocumentTypes>,
	siteOrigin: string,
	logLabel: string,
) {
	const { result, warnings } = htmlAsRichText(html.trim() || "<p></p>", {
		serializer: buildImgSerializer(migration, siteOrigin),
	});
	if (warnings.length) {
		console.warn(`htmlAsRichText [${logLabel}]: ${warnings.join("; ")}`);
	}
	return result;
}
