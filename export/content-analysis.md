# CMS content structure analysis (WordPress WXR)

**Source file:** `export/wordpress/parisgaelsgaa.WordPress.2026-04-14.xml`  
**Site:** https://parisgaelsgaa.org — Paris Gaels GAA  

This document summarizes **types, fields, taxonomies, relationships, and plugin metadata** visible in the export. It is the basis for Prismic custom types and converter design.

---

## 1. Executive summary

- **Editorial core:** `post` (60 published, 3 draft) and `page` (9 published; 5 draft, 1 private). Bilingual **Polylang** setup: `language` terms `en` / `fr` on posts and pages; **72** items carry a `post_translations` term (translation groups).
- **Layout:** Many pages use **Elementor** (`_elementor_data` JSON on **15** items). `content:encoded` may duplicate or complement Elementor (e.g. home page has both HTML in `content:encoded` and a structured `_elementor_data` tree referencing the same image and text).
- **Events:** **The Events Calendar** — **3** `tribe_events`, **6** `tribe_venue`, **1** `tribe_organizer`. Event bodies vary: some have **empty** `content:encoded`, others have rich HTML (bilingual blocks). Metadata uses standard `_Event*` and `_Venue*` / `_Organizer*` keys.
- **Navigation:** **20** `nav_menu_item` rows with standard `_menu_item_*` postmeta (rebuild in app routing / slices, not as Prismic “documents” 1:1).
- **Media:** **87** `attachment` rows; only **5** posts/pages reference `_thumbnail_id` in this export (featured image is not universal).
- **SEO / analytics noise:** Yoast (`_yoast_wpseo_*`), Essential Addons (`_eael_*`), TEC migration flags (`_tec_ct1_*`), aggregator metadata on **2** rows — mostly **safe to drop** for destination CMS unless you explicitly want parity.

---

## 2. WXR limitations (what this file does *not* contain)

- No `wp_options`, theme files, Elementor **global** kit, or widget areas.
- Menus reference object IDs; resolving labels/URLs is straightforward but **hierarchy** must be rebuilt from `_menu_item_menu_item_parent`.
- Not a full DB backup: some plugin data or ACF fields could exist only in the live DB (none obvious beyond standard postmeta in this export).

---

## 3. Content types (`wp:post_type`) → Prismic mapping hints

| WP type | Count | Migration stance |
| --- | ---: | --- |
| `attachment` | 87 | Import as **Prismic assets**; preserve `guid` / `wp:attachment_url` / `_wp_attached_file` for URL mapping. |
| `post` | 63 | Strong candidate for **one repeatable type** (e.g. `article` / `news_post`) + locale variant or separate documents per locale linked by translation id. |
| `page` | 15 | **Repeatable page type** or **slice-based homepage** + dedicated types for a few key pages (calendar, training). Many are paired EN/FR (`home`/`accueil`, `training`/`entrainements`, etc.). |
| `nav_menu_item` | 20 | **Do not model as Prismic documents**; encode navigation in code or a single `settings` / `navigation` custom type. |
| `tribe_events` | 3 | **Event** custom type: map `_Event*`, categories, tags, venue/organizer relations. |
| `tribe_venue` | 6 | **Venue** type or repeatable group on event (prefer separate type if venues are reused). |
| `tribe_organizer` | 1 | **Organizer** type or optional fields on event. |
| `tribe-ea-record` | 2 | **Skip** (aggregator plumbing). |
| `elementor_library` | 2 | **Skip** or manual reference only (template library). |
| `wp_global_styles` | 1 | **Skip**. |

### 3.1 Published pages (slug → title)

Pairs indicate likely Polylang siblings:

| Slug | Title |
| --- | --- |
| `accueil` | Accueil |
| `home` | Home |
| `entrainements` | Entraînements |
| `training` | Training |
| `calendrier` | Calendrier du club |
| `club-calendar` | Club Calendar |
| `contact-fr` | Contact |
| `contact-en` | Contact us |
| `plan-du-site` | Plan du site |

**Draft / non-public pages** in export: 5 `draft`, 1 `private` (e.g. default policy/legal shells). Decide whether to migrate drafts.

---

## 4. Standard RSS / WordPress fields (all `item` rows)

Per `<item>`:

| Field | Usage |
| --- | --- |
| `title` | Post/page/event title. |
| `link` | Canonical front-end URL (useful for redirects and UID derivation). |
| `pubDate` | RSS publication date. |
| `dc:creator` | Author login (also duplicated under `<wp:author>` at channel level). |
| `guid` | Often `?p=` style; **prefer `link` or `post_name` for stable routing**. |
| `content:encoded` | Primary HTML body for classic editor / mixed content. **May be empty** for TEC events. |
| `excerpt:encoded` | Usually empty in this export; do not rely on it. |
| `wp:post_id` | Integer PK (relationships, thumbnails, menu items). |
| `wp:post_date` / `_gmt` | Local / UTC creation. |
| `wp:post_modified` / `_gmt` | Last edit timestamps. |
| `wp:comment_status`, `wp:ping_status` | Often `closed`; low priority unless you add comments in Prismic. |
| `wp:post_name` | URL slug. |
| `wp:status` | `publish`, `draft`, `private`. |
| `wp:post_parent` | Page hierarchy (mostly `0` here); menu items use different parent semantics via meta. |
| `wp:menu_order` | Ordering (used on at least one event). |
| `wp:post_type` | Discriminator. |
| `wp:is_sticky` | `0` throughout sample — sticky posts not a theme. |
| `<category>` | Taxonomies: `category`, `post_tag`, `language`, `post_translations`, `tribe_events_cat`, etc. |

---

## 5. Polylang (multilingual)

**Evidence:** `language` taxonomy (`en`, `fr`), `post_translations` taxonomy with `pll_*` slugs, `_pll_menu_item`, `_pll_strings_translations`, `_pll_strings_translations` on terms, no `_wpml_*` keys.

**Counts (posts + pages only):**

- Items tagged with `language` nicename **`fr`:** 41  
- Items tagged with `language` nicename **`en`:** 37  
- Items with a **`post_translations`** category: **72** (translation groups linking EN/FR pairs)

**Migration implication:** For each `pll_*` group, create **linked Prismic locales** (or separate documents with a `translation_group` UID). Slugs are often parallel (`home` / `accueil`) but not guaranteed — use Polylang group id as source of truth.

---

## 6. Taxonomies (high level)

- **Blog:** Standard `category` and `post_tag` (sports years, locations, “Throwback Thursday”, “Planning de la semaine”, etc.).
- **Events:** `tribe_events_cat` — in this export, nicenames **`hurling-camogie-competition`** (2 events) and **`social`** (1 event). Yoast primary event category appears once (`_yoast_wpseo_primary_tribe_events_cat`).
- **Plugin / internal:** `wpcode_*`, `term_language`, `term_translations`, `post_translations` — mostly plumbing; **do not** surface as public editorial taxonomies in Prismic unless needed.

---

## 7. Elementor

**Frequency:** **15** `<item>` blocks include `_elementor_data` (large JSON string describing sections, columns, widgets).

**Common meta keys:** `_elementor_edit_mode`, `_elementor_template_type` (e.g. `wp-page`), `_elementor_version`, `_elementor_data`, `_elementor_controls_usage`, `_elementor_page_settings`, `_elementor_page_assets`, `_elementor_element_cache`.

**Widget/content patterns observed:** `image` widgets with `url` + attachment `id`; `text-editor` widgets with HTML `editor` string (overlaps with `content:encoded`).

**Migration strategies (pick one per page type):**

1. **Preferred:** Parse `_elementor_data` → ordered slices or Rich Text fields (more faithful layout).  
2. **Pragmatic:** Strip to `content:encoded` HTML only when it is complete (risk: duplicated or divergent content vs Elementor).  
3. **Hybrid:** Use `content:encoded` for SEO/body and Elementor only where HTML is thin.

**Risk:** Elementor versions change; JSON is verbose. Budget time for a dedicated Elementor → HTML or Elementor → slice normalizer.

---

## 8. The Events Calendar (`tribe_events`)

**Routing:** Links follow `/event/{slug}/`.

**`content:encoded`:** Can be empty; event detail may live only in title + venue + description elsewhere — **validate each event in the export.**

**Core postmeta (recurring):**

- Scheduling: `_EventStartDate`, `_EventEndDate`, `_EventStartDateUTC`, `_EventEndDateUTC`, `_EventDuration`, `_EventAllDay`, `_EventTimezone`, `_EventTimezoneAbbr`
- Display: `_EventShowMap`, `_EventShowMapLink`, `_EventURL`, `_EventCost`, `_EventCurrencySymbol`, `_EventCurrencyPosition`
- Relations: `_EventVenueID`, `_EventOrganizerID` (integer references to other `item` post_ids)
- Plugin: `_EventOrigin`, `_tribe_modified_fields`, `_tec_ct1_*` migration reports (optional to discard)

**Featured:** `_tribe_featured` appears on at least one event.

**Sample:** `tec_events_elementor_document` appears once — one event may have been edited with Elementor; check that item’s meta stack.

---

## 9. Venues (`tribe_venue`) and organizer (`tribe_organizer`)

**Venue meta (6 venues, repeated pattern):** `_VenueAddress`, `_VenueCity`, `_VenueProvince` / `_VenueState` / `_VenueStateProvince`, `_VenueZip`, `_VenueCountry`, `_VenuePhone`, `_VenueURL`, `_VenueShowMap`, `_VenueShowMapLink`, `_VenueOrigin`, plus `_VenueEventShowMap*` on at least one row.

**Organizer meta (1 row):** `_OrganizerEmail`, `_OrganizerPhone`, `_OrganizerWebsite`, `_OrganizerOrigin`.

**Relations:** Events reference venues (and sometimes organizers) by **post ID** in postmeta.

---

## 10. Attachments (`attachment`)

**Typical meta:** `_wp_attached_file`, `_wp_attachment_metadata` (serialized PHP — sizes, dimensions), `_wp_attachment_image_alt` (sparse), `_wp_attachment_context`, legacy `_wp_attachment_is_custom_header`, occasional `_oembed_*`.

**Usage:** Elementor JSON and `content:encoded` embed **absolute** `parisgaelsgaa.org/wp-content/uploads/...` URLs — plan **asset upload + URL rewrite** during migration.

---

## 11. Navigation (`nav_menu_item`)

Each menu item includes:

`_menu_item_type`, `_menu_item_menu_item_parent`, `_menu_item_object_id`, `_menu_item_object`, `_menu_item_url`, `_menu_item_target`, `_menu_item_classes`, `_menu_item_xfn`

**Use:** Reconstruct header/footer/nav trees in the Next app (or a Prismic singleton with repeatable link groups). Map `object` = `page` | `post` | `custom` etc. to new routes.

---

## 12. Other plugin footprints (postmeta frequency)

| Pattern | Interpretation |
| --- | --- |
| `_yoast_wpseo_*` | Yoast SEO — titles, descriptions, primary category, reading time, WordProof timestamp. Optional for Prismic SEO fields. |
| `_eael_*` | Essential Addons for Elementor — view counts, custom JS, TOC title in page settings. Low value for migration. |
| `footnotes` | Footnotes plugin (low volume). |
| `_tribe_aggregator_*` | Event Aggregator metadata on **2** items — ignore for editorial Prismic model. |

---

## 13. Relationships diagram (conceptual)

```text
post / page ──language──► en | fr
     │
     └──post_translations (pll_*)──► sibling post/page in other locale

tribe_events ──_EventVenueID──► tribe_venue (wp:post_id)
            └──_EventOrganizerID──► tribe_organizer

page/post ──_thumbnail_id──► attachment

nav_menu_item ──_menu_item_object_id──► post | page | custom URL
```

---

## 14. Risks and decisions for `/bootstrap-models`

1. **Elementor vs HTML:** Choose per template whether Prismic stores Rich Text only, slices, or both.  
2. **Locales:** Confirm Prismic locale codes (`en-gb` vs `en`, `fr-fr` vs `fr`) vs Polylang `en`/`fr`.  
3. **Events:** Decide if calendar becomes Prismic documents, embedded third-party (Google/TEC still), or hybrid.  
4. **Draft / private pages:** Include or exclude from scope.  
5. **Comments:** Export shows `comment_status`; if comments are unused, ignore.

---

## 15. Gaps vs live site (preview for Phase 3)

After **website structure** analysis, compare:

- All **published** page slugs above vs routes still live on https://parisgaelsgaa.org  
- **Event archive** and **single event** URLs (`/event/...`) vs Prismic routing plan  
- **Tag/category archives** and date archives — **not** represented as discrete WP “posts” in WXR; they may still exist as **templates** on the site

---

*Generated from WXR analysis. Counts and meta keys are derived mechanically from `export/wordpress/parisgaelsgaa.WordPress.2026-04-14.xml`.*
