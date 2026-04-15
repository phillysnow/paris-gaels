import type { SiteSettingsDocument } from "../../prismicio-types.js";
import type { WpChannel } from "../lib/wxr.js";

export type SiteSettingsPending = Pick<
	SiteSettingsDocument,
	"type" | "lang" | "data"
>;

export function convertChannelToSiteSettings(
	channel: WpChannel,
	lang = process.env.PRISMIC_LANG_FR ?? "fr-fr",
): { pending: SiteSettingsPending; title: string } {
	const pending: SiteSettingsPending = {
		type: "site_settings",
		lang,
		data: {
			club_tagline: channel.description || channel.title,
			header_banner: {},
			primary_navigation: [],
			social_links: [],
			footer_links: [],
		},
	};
	return { pending, title: "Site settings" };
}
