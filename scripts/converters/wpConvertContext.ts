import type { Migration } from "@prismicio/client";
import type { AllDocumentTypes } from "../../prismicio-types.js";
import type { WpAttachmentRecord } from "../lib/wpAttachments.js";

/** When set, inline `<img>` and `_thumbnail_id` use `migration.createAsset`. */
export type WpConvertContext = {
	migration: Migration<AllDocumentTypes>;
	attachmentById: Map<string, WpAttachmentRecord>;
	siteOrigin: string;
};
