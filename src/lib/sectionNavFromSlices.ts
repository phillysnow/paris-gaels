import { sectionIdFromKeyText } from "@/lib/section-id";

export const SLICE_SECTION_DEFAULTS: Record<string, string> = {
  Hero: "hero",
  StoryStats: "about",
  SportsGrid: "sports",
  TrainingLocations: "training",
  NewsShowcase: "news",
  JoinBand: "join",
};

type SliceLike = { slice_type: string; primary: Record<string, unknown> };

export function navItemsFromSlices(slices: readonly SliceLike[]): { anchor: string }[] {
  if (!Array.isArray(slices)) return [];

  const seen = new Set<string>();
  const items: { anchor: string }[] = [];

  for (const slice of slices) {
    const fallback = SLICE_SECTION_DEFAULTS[slice.slice_type];
    if (!fallback) continue;

    const primary = slice.primary as Record<string, unknown>;
    const anchor = sectionIdFromKeyText(primary?.section_id as string | null | undefined, fallback);
    if (seen.has(anchor)) continue;
    seen.add(anchor);
    items.push({ anchor });
  }

  return items;
}
