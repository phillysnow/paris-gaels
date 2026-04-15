# Output

- `./scripts/converters/{type}.ts` -- the converter.
- `./scripts/converters/helpers/*.ts` -- any shared helpers extracted (if applicable).
- `./scripts/converters/__tests__/{type}.test.ts` -- vitest snapshot tests.
- `./migration/document-conversion-{type}.md` documenting:
  - Field-by-field mapping table (source field -> Prismic field, transformation applied)
  - How relationships and internal links are resolved
  - Rich text handling notes (if applicable)
  - Model gaps found (if any): what's missing, how many documents are affected, recommended fix
  - Dry validation report: total documents processed, pass/fail counts, field coverage percentages, any remaining issues
  - Which test documents were selected and why