---
name: migration-runner
description: Specification for the configurable migration runner (migrate.ts). Use when bootstrapping or modifying the migration script.
---

<guidelines label="Important">

- Use `@prismicio/client` for migration operations (`createMigration()`, `createWriteClient()`, `migrate()`, `createDocument()`, `updateDocument()`, `createAsset()`).

</guidelines>

<guidelines label="Dependency preflight">

- Before implementing the runner, verify required packages: `npm ls @prismicio/client @prismicio/migrate`.
- If either package is missing, install it with `npm install @prismicio/client @prismicio/migrate`.
- Re-run `npm ls @prismicio/client @prismicio/migrate` and proceed only when both are present.
- If installation fails, stop immediately and report the exact install error to the user.

</guidelines>

<implementation-checklist>

# Implementation checklist

Copy this checklist before runner changes:

- [ ] Dependency preflight passed
- [ ] Runner modes implemented (dry/test/full/batch/retry)
- [ ] State persistence + backup behavior implemented
- [ ] Reference resolver + deferred updates implemented
- [ ] Error handling and structured summaries implemented
- [ ] Validation run completed

## Command pattern examples

- `npm ls @prismicio/client @prismicio/migrate`
- `npx tsx ./scripts/migrate.ts --mode=dry --type={type}`
- `npx tsx ./scripts/migrate.ts --mode=test --type={type} --uids={uid1,uid2}`
- `npx tsx ./scripts/migrate.ts --mode=full --type={type}`

Do not proceed to API-backed modes until dry mode succeeds.

</implementation-checklist>

<reference-map>

Read these reference files under `references/`:

- `references/specification.md`

</reference-map>