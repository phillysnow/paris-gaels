---
name: richtext-conversion
description: How to convert rich text from any CMS to Prismic RichText via the HTML intermediate path. Use when writing or fixing a rich text converter.
---

<guidelines label="Prerequisites">

- Read `./export/content-analysis.md` to identify the source CMS's rich text format (Contentful nodes, Storyblok richtext, Portable Text, HTML, Markdown, etc.), what embedded content it supports (images, videos, custom blocks), and any unusual patterns.
- Before implementing conversion logic, verify baseline dependency availability with `npm ls @prismicio/migrate`.
- If `@prismicio/migrate` is missing, install it with `npm install @prismicio/migrate`, then re-verify with `npm ls @prismicio/migrate`.
- If the source CMS requires an official rich text renderer package, verify it first (`npm ls <package>`), install it if missing (`npm install <package>`), then re-verify.
- If dependency installation fails, stop and report the exact install failure to the user.
- Use `@prismicio/migrate`'s `htmlAsRichText` function for the final HTML-to-Prismic conversion.
- Read a few sample documents containing rich text to understand the actual data shape. Don't rely solely on documentation -- verify against real exported content.

</guidelines>

<conversion-approach>

All rich text goes through HTML as an intermediate format:

1. **Source format -> HTML**: First, check if the source CMS has an official library or SDK for converting its rich text format to HTML (e.g. `@contentful/rich-text-html-renderer` for Contentful, `storyblok-rich-text-renderer` for Storyblok, `@portabletext/to-html` for Sanity/Portable Text). Search online for the CMS's recommended approach. If an official tool exists, use it -- it will handle edge cases better than a custom implementation. Only write a custom converter if no official tool is available. In either case, you may need to customize the output (e.g. via serializers or render overrides) to ensure embedded assets and internal links are handled correctly for the Prismic conversion step.
2. **HTML -> Prismic RichText**: Pass the HTML through `htmlAsRichText(html, config)` from `@prismicio/migrate`.

The `htmlAsRichText` function accepts a `serializer` config that maps HTML elements/CSS selectors to Prismic rich text node types. Use this to handle any CMS-specific HTML patterns (e.g. custom class names for styling).

</conversion-approach>

<what-to-handle>

- All standard block types: paragraphs, headings (h1-h6), lists (ordered and unordered), blockquotes, preformatted/code blocks.
- All standard inline types: bold, italic, links (both internal and external), inline code.
- **Embedded images**: use `migration.createAsset(url)` to register the asset and embed it in the rich text field. The `htmlAsRichText` serializer can handle `<img>` tags.
- **Internal links**: links within rich text that point to other pages on the same site (e.g. `<a href="/about">` or `<a href="https://example.com/blog/my-post">`) must be converted to Prismic document link references, NOT left as web links with hardcoded URLs. To do this:
  1. Read `./export/website-analysis.md` to understand the site's URL patterns and how they map to content types.
  2. Extract the href from the `<a>` tag, parse it to determine the content type and UID/slug.
  3. Use the migration runner's reference resolver to create a proper document link reference.
  4. Use the `htmlAsRichText` serializer's function form to intercept `<a>` tags and perform this resolution.
  5. If a URL cannot be mapped to a content type (e.g. external link or points to a page not in the export), keep it as a regular web link.
- **Embedded content that doesn't map to Prismic RichText**: tables, figures/figcaptions, videos, custom embeds, or any CMS-specific blocks. These should NOT be forced through rich text. Instead, flag them in the output so the converter can extract them as separate Prismic fields (e.g. a slice with an embed field, or a dedicated table field).

</what-to-handle>

<what-not-to-do>

- Do not write "direct converters" that go from the source format to Prismic RichText without the HTML intermediate step. The HTML path is the only supported approach.
- Do not silently drop content. Any content that can't be converted must be captured in the warnings array.

</what-not-to-do>

<output>

`./scripts/converters/richtext.ts` exporting:

- A function to convert the source CMS's rich text to Prismic RichText (e.g. `convertRichText(sourceField, migration, referenceResolver)`). Returns an object with both `result` (the Prismic RichTextField) and `warnings` (an array of strings describing anything that was skipped, dropped, or couldn't be fully converted). Warnings come from two sources: the source-to-HTML step and `htmlAsRichText` itself. Both should be merged and returned.
- A function to convert the source CMS's rich text to HTML (e.g. `richTextToHtml(sourceField)`) -- exported separately so it can be tested independently.
- A list of rich text features that could not be converted and need extraction as separate fields.

After creating the converter, run it against a few sample rich text fields from the export to verify it works. Fix any issues before returning control to the caller.

</output>