import type { WpItem } from "../converters/wpTypes.js";

export type WpAttachmentRecord = {
	postId: string;
	url: string;
	filename: string;
	alt: string;
};

/** Map WordPress attachment post ID → file URL + filename for Prismic `createAsset`. */
export function buildAttachmentIndex(items: WpItem[]): Map<string, WpAttachmentRecord> {
	const map = new Map<string, WpAttachmentRecord>();
	for (const it of items) {
		if (it.postType !== "attachment") continue;
		const url = (it.attachmentUrl ?? it.link).trim();
		if (!url) continue;
		let filename = url.split("/").pop() ?? "";
		filename = filename.split("?")[0] || `attachment-${it.postId}`;
		const alt =
			it.meta["_wp_attachment_image_alt"]?.trim() ||
			it.title?.trim() ||
			"";
		map.set(it.postId, {
			postId: it.postId,
			url,
			filename,
			alt,
		});
	}
	return map;
}

export function siteOriginFromChannel(channelLink: string): string {
	try {
		return new URL(channelLink).origin;
	} catch {
		return "https://parisgaelsgaa.org";
	}
}

function normalizeHost(hostname: string): string {
	return hostname.replace(/^www\./i, "").toLowerCase();
}

/** Only migrate images hosted on the WordPress site (avoids FB/Twitter CDNs breaking `migrate`). */
export function isSameSiteUrl(absoluteUrl: string, siteOrigin: string): boolean {
	try {
		const base = new URL(siteOrigin);
		const u = new URL(absoluteUrl);
		return normalizeHost(u.hostname) === normalizeHost(base.hostname);
	} catch {
		return false;
	}
}
