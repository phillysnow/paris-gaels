# Migration progress

Canonical checklist for `/script-migration`. Update after each major step.

---

## Checklist

- [x] **Validate prerequisites** — PASS (2026-04-14): `export/content-analysis.md`, `export/content-modeling.md`, `export/website-analysis.md`, `customtypes/`, `slices/`, `export/wordpress/content/` + WXR present.
- [x] **Generate/refresh migration plan** — PASS: `migration/migration-plan.md` created.
- [x] **Generate/refresh migration runner** — PASS: `scripts/migrate.ts` + `scripts/lib/*` + `scripts/converters/*`; `migration/migration-script.md` describes CLI. Dependency preflight: `npm ls @prismicio/client @prismicio/migrate` (both present).
- [x] **Migrate each content type in dependency order** — **`full --type=all` PASS** (2026-04-14): `site_settings` ×1, `landing_page` ×9, `article` ×60 (Prismic Migration API run finished with exit code 0).
- [ ] **Final migration summary + publish handoff** — Review migration release in Prismic, then publish when ready (see log).

---

## Log

| When | Step | Commands / outcome |
| --- | --- | --- |
| 2026-04-14 | Prerequisites | `ls export customtypes slices`; WXR at `export/wordpress/parisgaelsgaa.WordPress.2026-04-14.xml`; created `export/wordpress/content/README.md`. |
| 2026-04-14 | Plan | Wrote `migration/migration-plan.md`. |
| 2026-04-14 | Runner | `npm install fast-xml-parser --save-dev`; implemented `scripts/migrate.ts` (dry/test/full/batch/retry). |
| 2026-04-14 | Dry all | `npx tsx ./scripts/migrate.ts --mode=dry --type=all` → site_settings ok, landing_page 9, article 60, validation passed. |
| 2026-04-14 | Test (API) | With `node --env-file=.env.local --import tsx`: `test` OK for `site_settings`, `landing_page` (uids `accueil`, `contact-fr`), `article` (two EN posts). Fixes: TextBlock slice `id` must be `TextBlock$` + UUID; strip rich-text `image` nodes without Prismic media id; `publication_date` format `YYYY-MM-DDTHH:MM:SS+0000`. |
| 2026-04-14 | Full all | `node --env-file=.env.local --import tsx ./scripts/migrate.ts --mode=full --type=all` — exit 0 (~330s). `site_settings` updated; `landing_page` 7 creates + 9 updates; articles 58 creates + 60 updates. |

---

## Per-type gates

| Type | Dry validated | User approved | Test (`--mode=test`) | Full (`--mode=full`) |
| --- | --- | --- | --- | --- |
| `site_settings` | ✓ (dry all) | ✓ | ✓ | ✓ |
| `landing_page` | ✓ (dry all) | ✓ | ✓ | ✓ |
| `article` | ✓ (dry all) | ✓ | ✓ | ✓ |

*(Do not mark “User approved” until you explicitly confirm in chat after reviewing dry output.)*
