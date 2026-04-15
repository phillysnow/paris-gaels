import type { RichTextField, RTNode } from "@prismicio/client";

/**
 * Migration API rejects rich-text `image` nodes that only have a source URL and no
 * Prismic media `id`. Those come from `htmlAsRichText` on `<img>` until an asset pipeline exists.
 */
function isImageWithoutMediaId(node: RTNode): boolean {
	return (
		node.type === "image" &&
		(!("id" in node) || !(node as { id: string }).id?.trim())
	);
}

export function stripRichTextImagesWithoutMediaId(
	field: RichTextField,
): RichTextField {
	const filtered = field.filter((n) => !isImageWithoutMediaId(n));
	if (filtered.length === 0) {
		return [
			{
				type: "paragraph",
				text: "",
				spans: [],
				direction: "ltr",
			},
		] as RichTextField;
	}
	return filtered as RichTextField;
}
