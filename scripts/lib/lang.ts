import type { WpItem } from "../converters/wpTypes.js";
import { wpLangNicename } from "./wxr.js";

export function resolvePrismicLang(item: WpItem): string {
	const n = wpLangNicename(item);
	if (n === "en") return process.env.PRISMIC_LANG_EN ?? "en-gb";
	return process.env.PRISMIC_LANG_FR ?? "fr-fr";
}

/**
 * Sort a Polylang translation group so the **repository master locale** (`languages[0]`) is first.
 *
 * `@prismicio/client` creates all documents in that locale before other locales when applying a
 * migration. The second locale must use `masterLanguageDocument` pointing at the first; if the
 * pointer targets a doc that has not been POSTed yet, `alternate_language_id` is dropped and
 * Prismic shows no locale link.
 */
export function sortByRepositoryMasterLocaleFirst(
	a: WpItem,
	b: WpItem,
	masterLocale: string,
): number {
	const la = resolvePrismicLang(a);
	const lb = resolvePrismicLang(b);
	const aIsMaster = la === masterLocale;
	const bIsMaster = lb === masterLocale;
	if (aIsMaster && !bIsMaster) return -1;
	if (bIsMaster && !aIsMaster) return 1;
	return la.localeCompare(lb);
}
