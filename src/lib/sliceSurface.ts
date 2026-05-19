export function sliceSectionSurfaceClass(
  sliceType: string,
  index: number,
  slices: readonly { slice_type: string }[] = [],
): string {
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
