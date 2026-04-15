# Migration runner (`scripts/migrate.ts`)

## Dependencies

- `@prismicio/client` — `createWriteClient`, `createMigration`, `writeClient.migrate()`
- `@prismicio/migrate` — `htmlAsRichText` for `content:encoded` → Rich Text
- `fast-xml-parser` — WXR XML → items

## Environment

| Variable | Required for | Description |
| --- | --- | --- |
| `PRISMIC_WRITE_TOKEN` or `PRISMIC_MIGRATION_WRITE_TOKEN` | `test`, `full`, `batch`, `retry` | Repository write / migration token |
| `PRISMIC_REPOSITORY` | optional | Overrides `slicemachine.config.json` `repositoryName` |
| `PRISMIC_LANG_FR` | optional | Default `fr-fr` |
| `PRISMIC_LANG_EN` | optional | Default `en-gb` |
| `WXR_PATH` | optional | Default `export/wordpress/parisgaelsgaa.WordPress.2026-04-14.xml` |

## State

- **File:** `./migration/migration-state.json` (managed only by the runner — do not hand-edit).
- **Backups:** timestamped copy in `./migration/` before each API-backed run.

## Modes

| Mode | API calls | Purpose |
| --- | --- | --- |
| `dry` | No | Parse WXR, run converters, print validation counts |
| `test` | Yes | Subset: `--uids=a,b` (comma-separated post/page slugs) |
| `full` | Yes | All documents of `--type` |
| `batch` | Yes | Runs `site_settings` → `landing_page` → `article` in order |
| `retry` | Yes | Re-process entries marked `failed` in state (minimal implementation) |

## Reference resolver

`scripts/lib/referenceResolver.ts` exports a stub resolver compatible with the migration-runner specification; extend when cross-type `Link` / relationship fields are added.

## Images (WordPress → Prismic)

API-backed runs (`test` / `full` / `batch` / `retry`) pass a `WpConvertContext` into article/landing converters:

- **Featured / social:** `_thumbnail_id` on the post/page resolves against WXR `attachment` rows (`wp:attachment_url` + `_wp_attachment_image_alt`). Fills `featured_image` and `meta_image` via `migration.createAsset(url, filename, { alt })`.
- **Inline body:** `<img src>` in `content:encoded` is serialized with a custom `htmlAsRichText` rule that calls `createAsset` on the absolute URL (origin from WXR `channel.link`). Only **same-host** URLs as `channel.link` are uploaded (off-site images, e.g. Facebook CDNs, are skipped so migration does not fetch arbitrary third parties). `data:` URLs are skipped; failures log a warning and drop that image.

Helpers: `scripts/lib/wpAttachments.ts`, `scripts/lib/wpFeaturedImage.ts`, `scripts/lib/wpRichText.ts`. **Dry** mode does not call Prismic: converters strip unresolved RT images (legacy behaviour) so UID validation still runs.

## Document converter layout

- `scripts/converters/articleFromWp.ts`
- `scripts/converters/landingPageFromWp.ts`
- `scripts/converters/siteSettingsFromWp.ts`
- `scripts/converters/wpConvertContext.ts`
- Shared types: `scripts/converters/wpTypes.ts`

## One-pager seed (home documents)

After slice models are **pushed** to Prismic, you can prepend placeholder slices to **`accueil`** (`fr-fr`) and **`home`** (`en-gb`) with the Migration API:

```bash
node --env-file=.env.local --import tsx ./scripts/seed-home-onepager.ts --dry
node --env-file=.env.local --import tsx ./scripts/seed-home-onepager.ts --apply
```

Use `--force` to prepend even when a `Hero` slice already exists. NPM: `npm run seed:home -- --dry`.

## TypeScript types (`npm run typegen`)

`npm run typegen` runs `prismic codegen types`. If Prismic does not yet include every Shared Slice, the generated `prismicio-types.d.ts` can omit slice definitions and break the build. After a successful codegen from a complete repository, verify the app still compiles; restore or merge slice types if needed.
