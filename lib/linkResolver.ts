import type { LinkResolverFunction } from "@prismicio/client";

/**
 * Resolves preview and document links to App Router paths.
 * Accepts the same shape Prismic uses for `linkResolver` (document link fields).
 */
export const linkResolver: LinkResolverFunction = (doc) => {
	if (!doc || doc.link_type !== "Document") return null;

	const uid = doc.uid ?? doc.slug;
	if (!uid) return "/";

	if (doc.type === "article") {
		return doc.lang === "en-gb" ? `/en/article/${uid}` : `/article/${uid}`;
	}
	if (doc.type === "landing_page") {
		if (doc.lang === "en-gb") {
			return uid === "home" ? "/en" : `/en/${uid}`;
		}
		return uid === "accueil" ? "/" : `/${uid}`;
	}
	if (doc.type === "site_settings") {
		return "/";
	}
	return "/";
};
