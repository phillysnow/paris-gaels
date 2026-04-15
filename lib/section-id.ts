/** Safe HTML id for in-page anchors from Prismic Key Text. */
export function sectionIdFromKeyText(raw: string | null | undefined, fallback: string): string {
	const s = (raw ?? "").trim().replace(/[^a-zA-Z0-9_-]/g, "");
	return s || fallback;
}
