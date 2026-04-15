import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LandingPageView } from "@/components/document-views";
import { createClient } from "@/prismicio";

export async function generateMetadata(): Promise<Metadata> {
	const client = createClient();
	const doc = await client
		.getByUID("landing_page", "accueil", { lang: "fr-fr" })
		.catch(() => null);
	if (!doc) return {};
	const title = doc.data.meta_title?.trim() || "Accueil";
	return {
		title,
		description: doc.data.meta_description ?? undefined,
	};
}

export default async function FrenchHomePage() {
	const client = createClient();
	const doc = await client
		.getByUID("landing_page", "accueil", { lang: "fr-fr" })
		.catch(() => null);

	if (!doc) notFound();

	return <LandingPageView doc={doc} />;
}
