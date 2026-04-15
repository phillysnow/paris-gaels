# Live website structure analysis

**Site:** https://parisgaelsgaa.org — Paris Gaels GAA  
**Methods:** `robots.txt` → Yoast `sitemap_index.xml`; HTTP GET on homepage, events archive, sample event URL; inspection of HTML `<head>` and primary navigation (2026-04-14).

---

## 1. High-level information architecture

| Aspect | Observation |
| --- | --- |
| **Default locale** | French: root HTML uses `lang="fr-FR"`; canonical homepage is `https://parisgaelsgaa.org/`. |
| **English locale** | Paths prefixed with `/en/` (e.g. `/en/home/`, `/en/2024-09-01/...`). |
| **Hreflang** | Homepage exposes `<link rel="alternate" hreflang="fr" />` for `/` and `hreflang="en"` for `/en/home/`. |
| **Discovery** | Yoast SEO sitemap index at `https://parisgaelsgaa.org/sitemap_index.xml` (declared in `robots.txt`). |

---

## 2. URL patterns (routing contract)

### 2.1 Pages (static)

From **page-sitemap.xml** (9 URLs — all indexed):

| Pattern | Examples |
| --- | --- |
| FR home | `/` |
| FR pages | `/entrainements/`, `/calendrier/`, `/contact-fr/`, `/plan-du-site/` |
| EN pages | `/en/home/`, `/en/training/`, `/en/club-calendar/`, `/en/contact-en/` |

**Note:** FR and EN “same” content use **different slugs** (`accueil` vs `home`, `calendrier` vs `club-calendar`), aligned with Polylang pairs in the WXR.

### 2.2 Blog posts (`post`)

From **post-sitemap.xml`: **60** `<loc>` entries (matches **60 published posts** in the export).

| Locale | Pattern |
| --- | --- |
| FR | `https://parisgaelsgaa.org/{YYYY-MM-DD}/{post-slug}/` |
| EN | `https://parisgaelsgaa.org/en/{YYYY-MM-DD}/{post-slug}/` |

Day-first segments mirror classic **Permalink** “/%year%/%monthnum%/%day%/%postname%/” style, with **language prefix** inserted for EN.

### 2.3 Events (The Events Calendar)

| Pattern | Role |
| --- | --- |
| `/events/` | Main archive (TEC Views v2); canonical `https://parisgaelsgaa.org/events/`. Returns **200**. |
| `/event/{slug}/` | Single event (sample `…/event/2020-02-20-quiz-night/` returns **200**). |
| `/events/categorie/...` | Category archive URLs appear in **tribe_events_cat-sitemap.xml** (see below). |
| `?ical=1` | iCal export linked from HTML (`/events/?ical=1`). |

**Yoast sitemap index** lists `tribe_events_cat-sitemap.xml` but **does not** list a dedicated `event-sitemap` (unlike posts/pages). Single events may still be crawled via internal links and direct URLs; confirm SEO coverage if migrating.

### 2.4 Taxonomy archives

**Category sitemap** (5 URLs): e.g. `/category/competition/`, `/category/competition/hurling/`, `/category/planning-de-la-semaine/`, `/category/throwback-thursday/`, plus EN ` /en/category/planning-de-la-semaine-en/`.

**Tag sitemap:** **108** tag archive URLs (`post_tag-sitemap.xml`).

**Event categories (TEC):** 3 URLs —  
`https://parisgaelsgaa.org/events/categorie/hurling-camogie/`,  
`…/hurling-camogie/hurling-camogie-competition/`,  
`https://parisgaelsgaa.org/events/categorie/social/`.

### 2.5 Other

| Path | Notes |
| --- | --- |
| `/author/{slug}/` | Author archive (sitemap lists `…/author/parisgaels_contents/`). |
| `/?s={query}` | Site search (declared in Yoast JSON-LD `SearchAction`). |
| `/feed/`, `/events/feed/` | RSS / events feed. |

---

## 3. Primary navigation (homepage, FR)

**Menu “Menu supérieur” (`#menu-menu-superieur`):**

| Order | Label | Target |
| ---: | --- | --- |
| 1 | Accueil | `/` |
| 2 | Entraînements | `/entrainements/` |
| 3 | Calendrier du club | `/calendrier/` |
| 4 | Contact | `/contact-fr/` |
| 5 | English | `/en/home/` (Polylang language switcher, `lang="en-GB"`) |

**Social / external row (`#menu-menu-des-liens-de-reseaux-sociaux`):** Facebook, Twitter/X, Instagram, YouTube, plus **O’Neills official kit** (external commerce).

**Implication for Prismic / Next:** model **header links** as config or a singleton; keep **external** URLs explicit; Polylang switcher becomes **locale switcher** mapped to Prismic locale URLs.

---

## 4. Page shell and rendering

From homepage `<body>`:

- **Theme:** `wp-theme-apostrophe` (Apostrophe).
- **Page builder:** `elementor-page elementor-page-8`, `elementor-kit-180`, Elementor **4.0.2** in generator meta.
- **Home:** `page-id-8` — matches WXR **Accueil** (`post_id` 8). Entry content is rendered inside `div.elementor.elementor-8` (sections/columns/widgets mirror `_elementor_data` in the export).
- **Integrations (asset handles):** The Events Calendar, Elementor + **Essential Addons**, **Smash Balloon** Instagram, **Custom Facebook Feed**, **Custom Twitter Feeds**, Yoast SEO, **Google Site Kit** (gtag), WP **6.9.4**.

**Footer / widgets:** not fully enumerated here; migration can treat non-nav embeds (FB/IG feeds) as **rebuild in React** or third-party embeds.

---

## 5. REST / integration endpoints (for reference)

Linked from HTML:

- `https://parisgaelsgaa.org/wp-json/`
- `https://parisgaelsgaa.org/wp-json/wp/v2/pages/8` (type `application/json` discovery for homepage)
- `https://parisgaelsgaa.org/wp-json/tribe/events/v1/` (TEC REST)

Useful for **spot checks** during migration; the WXR remains the offline source of truth for bulk content.

---

## 6. CMS export vs live site (discrepancies and alignment)

| Topic | WXR (`content-export.md` / `content-analysis.md`) | Live site |
| --- | --- | --- |
| Published posts | 60 | Post sitemap: **60** URLs — **aligned**. |
| Published pages | 9 | Page sitemap: **9** URLs — **aligned**. |
| `tribe_events` rows | **3** in WXR | Singles resolve under `/event/{slug}/` (**200** on sample). Archive at `/events/`. **No** dedicated event URL list in Yoast index — expect **manual / crawl-based** discovery for events unless another sitemap exists. |
| Nav menu items | 20 `nav_menu_item` rows | Top nav shows **subset** (4 pages + home + lang); other items may be **other menus** or **footer** (not fully scraped). |
| Draft / private pages | Present in WXR | **Not** in page sitemap (expected). Decide migration scope. |
| Tags / categories | Many post terms | Live exposes **108** tag archives + **5** category sitemap URLs — plan whether Next reproduces **archive pages** or only **faceted listing** from Prismic. |
| Permalinks | `link` in WXR uses various forms | Live posts use **`/{date}/{slug}/`** and **`/en/{date}/{slug}/`** — use live URL as redirect target when building UID/slug strategy. |

---

## 7. Migration routing checklist (Prismic + Next)

1. **Locales:** Map Polylang `fr` → default route tree; `en` → `/en` prefix (or Prismic `en-gb` route segment — pick one convention).
2. **Posts:** Preserve **`/YYYY-MM-DD/`** segment if SEO retention matters; otherwise plan **301** from old URLs.
3. **Pages:** Preserve `/entrainements/`, `/en/training/`, etc., or systematic redirects from `link` values in the WXR.
4. **Events:** Implement `/events/` listing + `/event/[slug]` (or new path) + optional TEC category routes; import **3** events from WXR into an **Event** model.
5. **Archives:** Category/tag/author archives are **template-level** on WordPress, not separate CMS documents — recreate as **listing routes** querying Prismic by tag/category analogue if needed.
6. **Feeds / iCal:** Replace or redirect `/feed/`, `/events/feed/`, `?ical=1` if the club still depends on calendar subscribers.

---

## 8. Sources

- https://parisgaelsgaa.org/robots.txt  
- https://parisgaelsgaa.org/sitemap_index.xml  
- Child sitemaps: `page-sitemap.xml`, `post-sitemap.xml`, `category-sitemap.xml`, `post_tag-sitemap.xml`, `tribe_events_cat-sitemap.xml`, `author-sitemap.xml`  
- HTML samples: `/`, `/events/` (partial), HEAD checks on `/event/2020-02-20-quiz-night/`

---

*This document complements `export/wordpress/content-export.md` and `export/content-analysis.md`.*
