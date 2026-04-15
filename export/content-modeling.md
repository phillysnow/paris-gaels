# Prismic content modeling — Paris Gaels GAA

This document records **decisions and mappings** from `export/content-analysis.md` and `export/website-analysis.md` to the **local models** generated with the Prismic CLI (`npx prismic`). Schemas live under `customtypes/` and `slices/`; `prismic.config.json` connects the project to repository **`paris-gaels`** (same as `slicemachine.config.json`).

---

## 1. Source → Prismic entity map

| WordPress / site surface | Prismic model | Repeatable | Notes |
| --- | --- | --- | --- |
| `page` (published) | **`landing_page`** (page type) | Yes | UID = WP slug (`accueil`, `home`, …). `page_kind` select guides routing (`home`, `training`, `calendar`, …). |
| `post` | **`article`** (page type) | Yes | `publication_date`, **no taxonomy custom types** — WP categories/tags map to **Prismic document tags** (and Tags API) at write time. Slice zone for Elementor/HTML body. |
| `tribe_events` | *(no Prismic type)* | — | **Out of scope** for this repository model. Keep events on WordPress/TEC, another service, or reintroduce a dedicated type later (e.g. `club_event` or tagged `article`). |
| `tribe_venue` | *(no Prismic type)* | — | Venue rows from the export are **not** migrated into Prismic unless you add a type or fold data into another document shape. |
| `tribe_organizer` | *(no Prismic type)* | — | Same as venues. |
| `category` / `post_tag` (blog) | **Prismic tags** | — | Applied to `article` documents via Migration API / `@prismicio/migrate`; no `blog_category` / `blog_tag` custom types. |
| `tribe_events_cat` | **Prismic tags** (or ad-hoc filters) | — | No `event_category` custom type. |
| `nav_menu_item` + header/footer | **`site_settings`** (custom type, **singleton**) | No | `primary_navigation`, `social_links`, `footer_links` = **repeatable Link** with display text + target blank where needed (per content-modeling skill). |
| `attachment` | *(no custom type)* | — | Migrated as **Prismic assets**; referenced from Image / Rich Text / Link. |
| `nav_menu_item` (20 rows) | *(not 1:1 documents)* | — | Hierarchy resolved in migration script → ordered links in `site_settings`. |
| `tribe-ea-record`, `elementor_library`, `wp_global_styles` | *(intentionally omitted)* | — | See **tradeoffs**. |
| WP category/tag **archives** (templates) | *(no custom type)* | — | Next.js listing routes query **`article`** by **tag** (Prismic) or by route-specific filters. |

**Polylang:** `translation_group_id` (Text) on `landing_page` and `article` stores the `pll_*` slug from `post_translations` for pairing locales during migration.

---

## 2. Custom types (singleton + data)

### `site_settings` — Site settings

| Tab | Field | Type | Rationale |
| --- | --- | --- | --- |
| Main | `club_tagline` | Text | Matches visible site description under title. |
| Main | `header_banner` | Image | Optional hero/banner for shell (WP uses theme + uploads). |
| Navigation | `primary_navigation` | Link (repeat, text, target blank) | Top menu: Accueil, Entraînements, Calendrier, Contact. |
| Navigation | `social_links` | Link (repeat, text, target blank) | Social + O’Neills etc. |
| Navigation | `footer_links` | Link (repeat, text, target blank) | **Inference:** footer/legal row not fully scraped on live site; field reserved so nothing is “unmodeled” in analysis. |

---

## 3. Page types

### `landing_page`

- **Main:** `uid`, `page_kind`, `featured_image`, `translation_group_id`, **slice zone `slices`**.
- **Slices:** `TextBlock`, `ImageHighlight`, `CallToAction`.
- **SEO tab:** default `meta_title`, `meta_description`, `meta_image`.

### `article`

- **Main:** `uid`, `publication_date`, `featured_image`, `excerpt`, `translation_group_id`, **slices** (no category/tag link fields — use **document tags**).
- **Slices:** same three as landing page.
- **SEO tab:** default SEO fields.

---

## 4. Shared slices (PascalCase IDs)

| Slice | Variations | Primary fields | Purpose |
| --- | --- | --- | --- |
| **TextBlock** | `default` | `body` (Rich Text, full article blocks) | Paragraphs from Elementor `text-editor` or WP `content:encoded`. |
| **ImageHighlight** | `default` | `image`, `caption` | Elementor image widget + short caption. |
| **CallToAction** | `default` | `heading`, `description`, `cta` (repeatable Link, text, target blank) | Section CTAs; **no Link style variants** in schema (see tradeoffs). |

---

## 5. Completeness vs analyses

| Requirement | Status |
| --- | --- |
| Primary nav + social row (`website-analysis` §3) | Covered by `site_settings` link lists. |
| EN/FR routes and translation pairing | `translation_group_id` + locale documents in Prismic; routing is app concern. |
| Blog posts + taxonomies | `article` + **Prismic document tags** (WP categories/tags at migration). |
| Events + venues + organizer + TEC categories | **Not in Prismic** by design; see map rows for `tribe_*`. |
| Elementor / flexible layout | Slice zone (3 slices) on **`landing_page`** and **`article`**. |
| Footer / Instagram / Facebook embeds (live homepage assets) | **Gap:** not represented as fields — implement as **static layout components** or future `Embed` slice if editors need control. |
| Author archive (`/author/...`) | **Gap:** no `author` type; only two WP authors — can add **`author` custom type** later or hard-code in Next. |
| Search (`?s=`) | App-level; no model. |
| RSS / iCal | App-level redirects or reimplementation. |

---

## 6. Tradeoffs (intentional)

1. **Taxonomies and calendar content:** Blog taxonomies use **Prismic document tags** on **`article`** only. **The Events Calendar** posts (`tribe_events`, venues, organizers) have **no** Prismic custom/page type in this project—handle events elsewhere or extend the model later if needed.
2. **`CallToAction` Link variants:** Prismic’s slice **layout** variations were briefly added to satisfy an experimental `page-type add-field link --variation` pattern; they did not map cleanly to slice-level link styling. Variations were removed; **one** `default` variation holds **`cta`** (repeatable, with display text). Button **visual** variants (primary/outline) are deferred to **front-end** styling from link metadata or a later schema tweak in Slice Machine.
3. **`page_kind` select:** Coarse enum for key pages; **`other`** covers plan du site and edge cases. Slug remains source of truth in **UID**.
4. **Dropped WP types:** `tribe-ea-record`, `elementor_library`, `wp_global_styles` — no Prismic models (no editorial value).
5. **Yoast / EA / TEC migration postmeta:** Not modeled; reintroduce only if SEO parity is required (often `meta_*` on page types is enough).

---

## 7. CLI commands executed (summary)

- `prismic init --repo paris-gaels`
- `custom-type create` → `site_settings` (singleton) only (see §6 for dropped taxonomy/TEC types).
- `page-type create` → `landing_page`, `article` (`club_event` was added then **removed** per product choice).
- `slice create` → `TextBlock`, `ImageHighlight`, `CallToAction` (+ fields / variation cleanup as above)
- `page-type connect-slice` → all three slices on **`landing_page`** and **`article`** slice zones
- Numerous `custom-type add-field` / `page-type add-field` / `slice add-field` calls (see JSON in repo for exact configs).

---

## 8. Next steps for you

1. Run **`npm run slicemachine`** and open **http://localhost:9999** to review custom types, slices, and fields before locking the model.
2. Run **`npx prismic login`** then **`npx prismic push`** when you want models on the remote repository (`prismic status` currently requires login for remote operations).
3. When the model is approved, run **`/script-migration`** to plan and implement converters against these IDs.

---

*Models are generated only via the Prismic CLI per project rules; this markdown is the design record only.*
