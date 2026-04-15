# WordPress content export

## Provenance

| Field | Value |
| --- | --- |
| Format | WordPress eXtended RSS (WXR) 1.2 |
| Original file | User-supplied: `parisgaelsgaa.WordPress.2026-04-14.xml` |
| Generator | WordPress 6.9.4 (export timestamp 2026-04-14 17:36 UTC) |
| Canonical copy in repo | `export/wordpress/parisgaelsgaa.WordPress.2026-04-14.xml` (~2.2 MB, ~13.6k lines) |

## Site metadata (from `<channel>`)

| Field | Value |
| --- | --- |
| Title | Paris Gaels GAA |
| Public URL | https://parisgaelsgaa.org |
| Language (WP) | en-GB |
| Description | Le club de sports gaéliques de Paris, fondé en 1995 |

## Content inventory (`<item>` count: **200**)

Counts by `wp:post_type`:

| Count | Post type | Notes |
| ---: | --- | --- |
| 87 | `attachment` | Media library items (often migrated as Prismic assets) |
| 63 | `post` | Blog / news style posts |
| 20 | `nav_menu_item` | Navigation structure (rebuild in Next/site config, not 1:1 documents) |
| 15 | `page` | Static pages |
| 6 | `tribe_venue` | The Events Calendar — venues |
| 3 | `tribe_events` | The Events Calendar — events |
| 2 | `elementor_library` | Elementor templates / library (layout source, not editorial “content types”) |
| 2 | `tribe-ea-record` | TEC aggregated import metadata |
| 1 | `tribe_organizer` | TEC organizer |
| 1 | `wp_global_styles` | Block theme global styles (usually ignored for CMS migration) |

## Taxonomies and plugins (evidence in export)

- **Categories / tags**: Standard `wp:category` and `wp:tag` blocks present (club, competition, planning, etc.).
- **The Events Calendar**: `tribe_events`, `tribe_venue`, `tribe_organizer`, `tribe-ea-record`, `tribe_events_cat` terms.
- **Elementor**: `elementor_library` items — page body may be shortcodes/Elementor data rather than classic HTML in `content:encoded`.
- **Multilingual**: Terms such as `language`, `term_language`, `post_translations`, `term_translations` suggest Polylang-style linking between EN/FR (or similar); verify in Phase 2 against post pairs and slugs.
- **WPCode**: `wpcode_*` term taxonomies (snippet plugin metadata; low value for destination CMS modeling).

## Privacy / repo hygiene

The raw WXR includes WordPress author blocks (logins, emails, display names). If this repository is public, consider redacting those sections or keeping the XML out of version control and referencing a private artifact store instead.

## Next analysis step

Use this file as the single source of truth for **Phase 2** (`export/content-analysis.md`): map each post type to candidate Prismic custom types, extraction strategy (HTML vs Elementor JSON), events/venues, and translation groups.
