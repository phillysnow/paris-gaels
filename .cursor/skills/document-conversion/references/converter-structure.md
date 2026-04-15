# Converter structure

Each converter goes in `./scripts/converters/{type}.ts`. It must export a function matching the interface defined by the migration runner (see `./migration/migration-script.md`). The function takes a source document (parsed JSON) and the reference resolver, and returns a Prismic document structure.

- Import and use the generated Prismic TypeScript types for type safety.
- Import the reference resolver from the migration runner. Use it for ALL content relationships instead of resolving references manually.