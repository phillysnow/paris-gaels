import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { LandingPageView } from "@/components/document-views";
import { createClient } from "@/prismicio";

/** Single-segment paths reserved for other App Router routes. */
const RESERVED_UID = new Set(["article", "en", "api", "slice-simulator"]);

type Props = { params: Promise<{ uid: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { uid } = await params;
	if (RESERVED_UID.has(uid)) return {};

	const client = createClient();
	const doc = await client
		.getByUID("landing_page", uid, { lang: "fr-fr" })
		.catch(() => null);
	if (!doc) return {};
	return {
		title: doc.data.meta_title?.trim() || doc.uid,
		description: doc.data.meta_description ?? undefined,
	};
}

export default async function FrenchLandingByUid({ params }: Props) {
	const { uid } = await params;

	if (uid === "accueil") {
		redirect("/");
	}

	if (RESERVED_UID.has(uid)) notFound();

	const client = createClient();
	const doc = await client
		.getByUID("landing_page", uid, { lang: "fr-fr" })
		.catch(() => null);

	if (!doc) notFound();

	return <LandingPageView doc={doc} />;
}
