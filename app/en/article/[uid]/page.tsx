import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleView } from "@/components/document-views";
import { createClient } from "@/prismicio";

type Props = { params: Promise<{ uid: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { uid } = await params;

	const client = createClient();
	const doc = await client
		.getByUID("article", uid, { lang: "en-gb" })
		.catch(() => null);
	if (!doc) return {};
	return {
		title: doc.data.meta_title?.trim() || doc.uid,
		description: doc.data.meta_description ?? undefined,
	};
}

export default async function EnglishArticlePage({ params }: Props) {
	const { uid } = await params;

	const client = createClient();
	const doc = await client
		.getByUID("article", uid, { lang: "en-gb" })
		.catch(() => null);

	if (!doc) notFound();

	return <ArticleView doc={doc} />;
}
