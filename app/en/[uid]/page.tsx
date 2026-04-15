import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { LandingPageView } from "@/components/document-views";
import { createClient } from "@/prismicio";

type Props = { params: Promise<{ uid: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { uid } = await params;

	const client = createClient();
	const doc = await client
		.getByUID("landing_page", uid, { lang: "en-gb" })
		.catch(() => null);
	if (!doc) return {};
	return {
		title: doc.data.meta_title?.trim() || doc.uid,
		description: doc.data.meta_description ?? undefined,
	};
}

export default async function EnglishLandingByUid({ params }: Props) {
	const { uid } = await params;

	if (uid === "home") {
		redirect("/en");
	}

	const client = createClient();
	const doc = await client
		.getByUID("landing_page", uid, { lang: "en-gb" })
		.catch(() => null);

	if (!doc) notFound();

	return <LandingPageView doc={doc} />;
}
