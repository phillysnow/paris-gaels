# Migration runner specification

## Non-negotiable requirements

The following are MUST-HAVE features. Do not ship the runner without all of these working and tested. These are the most common sources of bugs -- implement them carefully.

### 1. Prismic ID tracking

After every successful document creation, the runner MUST immediately save the Prismic document ID returned by the Migration API into the state file. This is the `id` field from the API response. Without this, the runner cannot update documents or resolve cross-run references.

The `writeClient.migrate()` call MUST be wrapped in a `try/finally` block. The `finally` block must iterate over the migration's documents, capture any assigned `id` values back into the state file, and call `saveState()`. This ensures that if the run crashes during the update phase, document IDs assigned during the create phase are still persisted.

**Test this**: after creating a document, read the state file back and verify the ID is there. Then simulate a crash during the update phase and verify the IDs from the create phase were still saved.

### 2. Upsert (create or update)

Before creating any document, check the state file. If a document with the same `(type, uid)` already exists (has a saved Prismic ID), call `updateDocument` with that ID instead of `createDocument`. This enables the iterate-and-re-test workflow. The user should NEVER need to manually clear a migration release.

When updating a document, the converter must produce the COMPLETE document data -- not a partial update. The Migration API replaces the document data entirely on update. If the converter omits fields (e.g. link labels, metadata), those fields will be wiped.

**Test this**: run the same document twice and verify it updates rather than creating a duplicate. Also verify that no fields are lost on the second run.

### 3. Dry validation mode

The runner MUST support a dry-run mode that validates converters locally without making any Prismic API calls. In dry-run mode:

- Run the converter against exported documents
- Validate the output: required fields present, field types match the Prismic model, UIDs are unique
- Report results: pass/fail counts, field coverage percentages, specific errors
- Exit without touching the Prismic API

Dry validation is the first thing the orchestrator runs for every type. It must work before any documents are pushed.

### 4. Reference resolver

Provide and export a reference resolver function that converters use for ALL content relationships:

1. Checks if the referenced document is in the current migration run -- if so, return the `PrismicMigrationDocument` instance directly. The SDK resolves these automatically during the update phase.
2. Checks the state file for a previously migrated document -- if found, construct a content relationship field using the stored Prismic document ID: `{ link_type: "Document", id: "<prismic-id>" }`.
3. If not found in either, registers a deferred update and returns null.

**Prefer same-run references**: to avoid cross-run reference issues, the runner should add ALL documents that might be referenced (even from previously migrated types) to the current migration run via `migration.createDocument()`. If a document already exists (has an ID in the state file), pass the existing document as a `PrismicMigrationDocument` with its `id` pre-set so the SDK uses it for reference resolution without re-creating it. The SDK skips creating documents that already have an `id` (see the WriteClient create phase: `if (!doc.document.id)` check).

**Known issue -- "Deleted page" in migration release**: document links between documents in a migration release may show as "Deleted page" in the Prismic dashboard. This can happen when cross-run references use raw `{ link_type: "Document", id }` objects instead of `PrismicMigrationDocument` instances. Use the same-run approach above to avoid this.

Converters MUST use this resolver instead of resolving references manually or calling `migration.getByUID()` directly.

### 5. Deferred updates

After each type migration completes:

- Check the deferred update queue for relationships that can now be resolved.
- Call `updateDocument` for each resolved deferred update.
- Remove resolved entries from the queue.

### 6. UID conflict recovery

If the Migration API throws "A document with this UID already exists" during document creation, the runner MUST NOT crash. Instead it should:

1. Log a warning.
2. Attempt to resolve the conflict by looking up the document in the state file, or by trying to update the existing document.
3. Record the situation in the state file.

The Prismic Migration API does not expose a document listing endpoint, so lost IDs cannot be recovered through the API. Prevention (via the try/finally state save in requirement #1) is the only reliable strategy. This handler is a last-resort fallback.

### 7. State file backup

Before every migration run, the runner MUST create a timestamped backup of the state file (e.g. `migration-state.2026-03-06T14-00.json` in the `./migration/` folder). The state file is the single source of truth for document-to-ID mappings. If it is lost or corrupted, the migration release becomes unrecoverable without manual intervention.

### 8. Logging
Provide progress output during migration (e.g. Creating document 3/50: blog-post-hello-world)

## Runner modes

The runner must support these modes, selectable via CLI arguments or programmatic API:

- **Dry-run mode**: validate converters locally without any Prismic API calls (see requirement #3 above).
- **Test mode**: migrate specific documents of a specific type (by filename or UID). Used during the per-type review loop to test 1-2 representative documents.
- **Full mode**: migrate all documents of a specific type. Used after the user approves a type.
- **Batch mode**: migrate all types in the planned order, respecting batch boundaries and the 1,000 document limit.
- **Retry mode**: re-process only documents with `status: "failed"` in the state file.

## State file

Migration state file (`./migration/migration-state.json`):

**CRITICAL**: Documents in a migration release are NOT queryable via the Prismic Content API. You cannot call `getByUID()` or any other API method to find documents that haven't been published yet. The state file is the ONLY way to know which documents have been created and what their Prismic IDs are. If the state file is lost, there is no way to recover the mapping between source documents and migration release documents.

The state file must track:

- **Source-to-Prismic ID mapping**: for each migrated document, maps `(type, uid)` to the Prismic document `id` returned by the Migration API. Updated immediately after each successful document creation.
- **Completed types**: which types have been fully migrated.
- **Failed documents**: for each document that failed, stores the source file path, the error message, and the status `"failed"`.
- **Deferred updates**: a queue of relationships that couldn't be resolved because the target type hasn't been migrated yet.

## Localization

Ensure master locale documents are created before alternate language documents. For alternate language documents, look up the master language document's Prismic ID from the state file and pass it as `masterLanguageDocument`.

## Error handling

- When a document fails, record it in the state file with `status: "failed"`, the error message, and the source file path.
- Continue processing remaining documents (don't abort on individual failures).
- After the run completes, produce a structured error summary that groups failures by cause (e.g. "4 blog posts failed: all have null `author` field").

## Converter interface

Define and export a clear TypeScript interface that converters must implement. Each converter module should export a function that takes a source document (parsed JSON) and the reference resolver, and returns a Prismic document ready for the migration API. Document this interface clearly in the output markdown.