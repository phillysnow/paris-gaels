/**
 * Alternating section backgrounds for landing slices (warm white vs light blue).
 * Hero is excluded — it keeps its own full-bleed dark treatment.
 *
 * First non-Hero slice uses warm; then alternates.
 *
 * @param {string} sliceType
 * @param {number} index
 * @param {import("@prismicio/client").Slice[]} slices
 * @returns {string} Tailwind classes for the outer `<section>`
 */
export function sliceSectionSurfaceClass(sliceType, index, slices = []) {
	if (sliceType === "Hero") {
		return "";
	}
	const safeIndex = typeof index === "number" ? index : 0;
	const nonHeroBefore = slices
		.slice(0, safeIndex)
		.filter((s) => s.slice_type !== "Hero").length;
	const isWarm = nonHeroBefore % 2 === 0;
	const bg = isWarm ? "bg-pg-warm" : "bg-pg-surface-blue";
	return `${bg} border-t border-black/[0.06]`;
}
