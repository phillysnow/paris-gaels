import type { SiteSettingsDocument } from "@/prismicio-types";
import { createClient } from "@/prismicio";

export async function getSiteSettings(
	lang: "fr-fr" | "en-gb",
): Promise<SiteSettingsDocument | null> {
	const client = createClient();
	return client.getSingle("site_settings", { lang }).catch(() => null);
}
