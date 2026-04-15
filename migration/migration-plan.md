# Migration plan — Paris Gaels (WordPress → Prismic)

**Sources:** `export/content-analysis.md`, `export/content-modeling.md`, `export/website-analysis.md`  
**Bulk export:** `export/wordpress/parisgaelsgaa.WordPress.2026-04-14.xml`  
**Target repo:** `paris-gaels` (see `slicemachine.config.json` / `prismic.config.json`)

---

## 1. Scope

| Prismic type | WordPress source | Count (published, from analysis) |
| --- | --- | --- |
| `site_settings` | Singleton; channel metadata + optional nav (manual / phase 2) | 1 |
| `landing_page` | `page`, `publish` | 9 |
| `article` | `post`, `publish` | 60 |

**Out of scope:** `tribe_events`, attachments as first-class types (assets created lazily when image pipeline is added), Yoast/EAA/TEC plugin meta unless needed later.

---

## 2. Dependency order

1. **`site_settings`** — no UID; no inbound references. Create first (singleton).
2. **`landing_page`** — no hard dependency on settings; may link to internal URLs later.
3. **`article`** — same; uses **document tags** for WP categories/tags (no custom types).

Cross-document references between pages/posts are uncommon in this export; **reference resolver** is scaffolded for future use.

---

## 3. Locales and translations

- Polylang `language` terms: `fr`, `en`.
- **Default Prismic locale IDs** assumed by the runner (override with env if your repo differs):
  - `PRISMIC_LANG_FR` (default `fr-fr`)
  - `PRISMIC_LANG_EN` (default `en-gb`)
- **Alternate documents:** for items sharing the same `post_translations` (`pll_*`) slug, create **master locale first** (`fr` before `en` in each pair), then the alternate with `masterLanguageDocument` pointing at the master’s migration document instance.

If your repository uses different locale API IDs, set the env vars **before** `test` / `full` / `batch` runs.

---

## 4. Field mapping (summary)

### `article`

| Prismic | WordPress |
| --- | --- |
| `uid` | `wp:post_name` |
| `lang` | from `category[@domain=language]` |
| `publication_date` | `wp:post_date_gmt` (ISO timestamp) |
| `featured_image` | *(phase 2: `_thumbnail_id` → asset)*; empty for MVP |
| `excerpt` | plain text from `excerpt:encoded` or stripped `content:encoded` |
| `translation_group_id` | `category[@domain=post_translations]` nicename |
| `slices` | Single **TextBlock** slice: `htmlAsRichText(content:encoded)` |
| `meta_*` | optional: title → `meta_title`, generated description |
| **Tags** | WP `category` where `domain` is `category` or `post_tag` → Prismic document `tags` array on create (Migration API) |

### `landing_page`

| Prismic | WordPress |
| --- | --- |
| `uid` | `wp:post_name` |
| `lang` | Polylang language category |
| `page_kind` | Derived from slug (`home`, `training`, …, `other`) |
| `featured_image` | phase 2 |
| `translation_group_id` | `pll_*` |
| `slices` | TextBlock from `content:encoded` |
| `meta_*` | from title / excerpt as needed |

### `site_settings`

| Prismic | WordPress |
| --- | --- |
| `club_tagline` | `<channel><description>` |
| `header_banner` | empty initially |
| `primary_navigation` / `social_links` / `footer_links` | empty arrays initially; fill via Slice Machine or a follow-up nav parser from `nav_menu_item` |

---

## 5. Batching and limits

- Single WXR, <200 items: **one batch per type** is sufficient.
- Prismic Migration API document limit (e.g. 1,000) is not a concern for this site.

---

## 6. Risks

| Risk | Mitigation |
| --- | --- |
| Wrong locale API IDs | Env overrides + dry-run log of `lang` per document. |
| Rich text / HTML edge cases | `htmlAsRichText` warnings logged; extend serializers later. |
| Featured images | Deferred; empty `featured_image` until asset pipeline exists. |
| `site_settings` already exists in migration release | Runner upserts via `updateDocument` when state holds a Prismic `id`. |

---

## 7. Commands

```bash
npx tsx ./scripts/migrate.ts --mode=dry --type=site_settings
npx tsx ./scripts/migrate.ts --mode=dry --type=landing_page
npx tsx ./scripts/migrate.ts --mode=dry --type=article
npx tsx ./scripts/migrate.ts --mode=dry --type=all

# Requires PRISMIC_WRITE_TOKEN (or PRISMIC_MIGRATION_WRITE_TOKEN)
npx tsx ./scripts/migrate.ts --mode=test --type=article --uids=some-slug
npx tsx ./scripts/migrate.ts --mode=full --type=article
```

---

*Last updated during `/script-migration` bootstrap.*
