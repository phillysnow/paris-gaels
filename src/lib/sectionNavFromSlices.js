import { sectionIdFromKeyText } from "@/lib/section-id";

/**
 * Slice types that expose `primary.section_id` (must match slice components'
 * fallback strings for sectionIdFromKeyText).
 */
export const SLICE_SECTION_DEFAULTS = {
  Hero: "hero",
  StoryStats: "about",
  SportsGrid: "sports",
  TrainingLocations: "training",
  NewsShowcase: "news",
  JoinBand: "join",
};

/**
 * @param {import("@prismicio/client").Slice[]} slices
 * @returns {{ anchor: string }[]}
 */
export function navItemsFromSlices(slices) {
  if (!Array.isArray(slices)) return [];

  /** @type {Set<string>} */
  const seen = new Set();
  /** @type {{ anchor: string }[]} */
  const items = [];

  for (const slice of slices) {
    const fallback = SLICE_SECTION_DEFAULTS[slice.slice_type];
    if (!fallback) continue;

    const anchor = sectionIdFromKeyText(slice.primary?.section_id, fallback);
    if (seen.has(anchor)) continue;
    seen.add(anchor);
    items.push({ anchor });
  }

  return items;
}
