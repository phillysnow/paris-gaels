# Internal link resolution

Source CMS content is full of internal links stored as hardcoded URLs (e.g. `https://example.com/about`, `/blog/my-post`). These appear in navigation menus, rich text content, CTA buttons, link fields, and any field that references another page.

**ALL internal links MUST be converted to Prismic document references.** Do not leave them as URL strings. To do this:

1. Read `./export/website-analysis.md` to understand the site's URL structure and how URL paths map to content types (e.g. `/blog/{slug}` -> blog_post, `/team/{slug}` -> team_member, `/{slug}` -> page).
2. Build a URL-to-document mapping helper that parses a URL, determines the content type and UID/slug, and uses the reference resolver to create a Prismic document link.
3. Apply this to every link field, CTA, navigation item, and rich text link in the converter.
4. If a URL can't be mapped (external link, or points to a page not in the export), keep it as a web link.

The rich text converter (`./scripts/converters/richtext.ts`) also handles links inside rich text content. See the `richtext-conversion` skill for details.