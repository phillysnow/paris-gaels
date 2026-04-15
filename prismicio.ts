import {
	createClient as baseCreateClient,
	type Route,
} from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import type { AllDocumentTypes } from "./prismicio-types";
import sm from "./slicemachine.config.json";

export const repositoryName =
	process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * Route resolver for `document.url` and link resolution.
 * Paths mirror the App Router (`app/…`) — adjust if you change URLs.
 */
const routes: Route[] = [
	{ type: "landing_page", lang: "fr-fr", uid: "accueil", path: "/" },
	{ type: "landing_page", lang: "fr-fr", path: "/:uid" },
	{ type: "landing_page", lang: "en-gb", uid: "home", path: "/en" },
	{ type: "landing_page", lang: "en-gb", path: "/en/:uid" },
	{ type: "article", lang: "fr-fr", path: "/article/:uid" },
	{ type: "article", lang: "en-gb", path: "/en/article/:uid" },
];

export function createClient(config: Parameters<typeof baseCreateClient>[1] = {}) {
	const client = baseCreateClient<AllDocumentTypes>(repositoryName, {
		routes,
		...config,
	});
	enableAutoPreviews({ client });
	return client;
}
