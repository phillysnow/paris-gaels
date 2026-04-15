# Migration plan

## Scope
- Which types are included (and any the user chose to skip)

## Dependency order
- Ordered list of types to migrate
- For each: document count and reason for ordering
- Dependency graph: which types reference which, and any circular dependencies noted

## Batch strategy
- How documents are grouped into batches (respecting the 1,000 document limit)
- Locale strategy: which locales exist, master locale, batching per locale
- Master locale documents are created before alternate language documents

## Circular dependencies
- Which type pairs have circular references
- Which direction is primary (migrated first with empty reference)
- Which references will be patched via deferred updates after both types exist

## Risks and decisions
- Any ambiguities or risks that need human input
- Types where the modeling tradeoffs may affect migration quality
- Any types with unusual patterns flagged in content-analysis.md