import { randomUUID } from "node:crypto";
import type { RichTextField } from "@prismicio/client";
import type { TextBlockSlice } from "../../prismicio-types.js";

export function textBlockSliceFromRichText(body: RichTextField): TextBlockSlice {
	/** Migration API expects `slice_type$uuid` (see Prismic validation on `data.slices.*.id`). */
	const id = `TextBlock$${randomUUID()}`;
	return {
		id,
		slice_type: "TextBlock",
		slice_label: null,
		variation: "default",
		version: "initial",
		primary: { body },
		items: [],
	};
}
