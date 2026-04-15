import { notFound } from "next/navigation";

/** Avoid treating `/article` as a landing UID (`app/[uid]`). */
export default function ArticleIndexPlaceholder() {
	notFound();
}
