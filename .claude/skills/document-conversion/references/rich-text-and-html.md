# Rich text and HTML

- **Rich text fields in Prismic** (type `StructuredText`): use the rich text converter when you encounter rich text fields at `./scripts/converters/richtext.ts`. If it does not exist, create it first using the `richtext-conversion` skill.
- **Source HTML going into a Prismic rich text field**: ALWAYS convert it through the rich text converter. Never put raw HTML strings into a Prismic rich text field -- that produces visible HTML tags in the output.
- **Source HTML going into a Prismic key text (plain text) field**: strip all HTML tags and extract just the text content.
- Content that the rich text converter flags as non-convertible (tables, embeds, custom blocks) should be extracted as separate Prismic fields or slices.