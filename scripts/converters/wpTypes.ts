/** Normalized WordPress RSS item from WXR (subset of fields used by converters). */
export type WpItem = {
	postId: string;
	postType: string;
	status: string;
	postName: string;
	title: string;
	/** RSS `pubDate` (fallback if GMT date is invalid). */
	pubDate: string;
	link: string;
	contentHtml: string;
	excerptHtml: string;
	postDateGmt: string;
	categories: WpCategoryTag[];
	/** Populated when parsing WXR `<wp:postmeta>` rows. */
	meta: Record<string, string>;
	/** Present on `attachment` items: `wp:attachment_url`. */
	attachmentUrl?: string;
};

export type WpCategoryTag = {
	domain: string;
	nicename: string;
	label: string;
};
