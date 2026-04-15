---
name: document-conversion
description: Techniques for writing per-type document converters that transform source CMS content into Prismic documents. Use when writing or fixing a type converter.
---

<guidelines label="Prerequisites">

- Read `./export/content-modeling.md` to understand the target Prismic model for this type: field mappings, what was preserved, simplified, or dropped, and the slice architecture.
- Read `./export/content-analysis.md` to understand the source structure: fields, types, relationships, and patterns.
- Read `./migration/migration-plan.md` to understand where this type fits in the migration order.
- Before writing converter code, verify required dependencies with `npm ls @prismicio/client @prismicio/migrate`.
- If a required package is missing, install it with `npm install @prismicio/client @prismicio/migrate` and re-verify with `npm ls @prismicio/client @prismicio/migrate`.
- If dependency installation fails, stop and report the exact install error to the user before continuing.
- Read the relevant Prismic model in `./customtypes/` to know the exact target schema (field names, types, required fields).
- Read several exported documents of this type in `./export/{cms}/content/` to understand the real data shape. Don't rely solely on analysis docs -- verify against actual content.

</guidelines>

<implementation-checklist>

# Implementation checklist

Copy and track this checklist for each type conversion:

- [ ] Dependencies verified/installed
- [ ] Converter implementation complete
- [ ] Dry validation passed for all documents of this type
- [ ] Field coverage report produced
- [ ] Snapshot tests added and passing
- [ ] Test-document selection documented

## Command pattern examples

- `npm ls @prismicio/client @prismicio/migrate`
- `npx tsx ./scripts/migrate.ts --mode=dry --type={type}`
- `npx vitest run ./scripts/converters/__tests__/{type}.test.ts`

Do not proceed to test migration until dry validation is clean and required-field mapping coverage is reported.

</implementation-checklist>

<reference-map>

Read these reference files under `references/`:

- `references/converter-structure.md`
- `references/internal-link-resolution.md`
- `references/rich-text-and-html.md`
- `references/field-type-transformations.md`
- `references/model-gap-detection.md`
- `references/dry-validation.md`
- `references/vitest-snapshot-tests.md`
- `references/test-document-selection.md`
- `references/shared-helpers.md`
- `references/output.md`

</reference-map>