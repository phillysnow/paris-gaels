---
name: content-modeling
description: Prismic content modeling: page types, custom types, slices, field selection, and naming. Use when designing or reviewing Prismic models.
---

<guidelines label="Prerequisites">

- Familiarize yourself with the Prismic CLI by running `npx prismic --help`.

</guidelines>

<prismic-building-blocks>

Four building blocks: fields, page types, custom types, and slices.

## Fields

Available types: Boolean, Color, Content Relationship, Date, Embed, Geopoint, Image, Integration, Link, Link to Media, Number, Repeatable Group, Rich Text, Select, Table, Text, Timestamp, UID.

### Field type selection

- **Rich Text** — formatted content (paragraphs, headings, lists, links, embedded images).
- **Text** (key text) — plain strings (slugs, labels, short titles).
- **Content Relationship** — references to other documents.
- **Link** — internal or external URLs. Configure CTA links with the appropriate Link field features (see below).
- **Image** — visuals needing responsive sizing.
- **Link to Media** — downloadable files (PDFs, documents).
- **Group** — repeated items within a slice (cards, list items, team members). If the only field in a group is a Link, use a repeatable Link field instead.
- **Select** — constrained choices (theme: light/dark, layout: left/right).
- **Boolean** — true binary toggles only. More than two options → use Select.
- **Embed** — oEmbed content (videos, external media).

### Link field features (mandatory checklist)

The Link field has built-in features that eliminate the need for extra fields. **Before creating any Link field, evaluate all three features and enable each one that applies.** This is not optional — skipping this checklist is a modeling error.

1. **Display text** (`--allow-text`): does this link need a visible label ("Learn more", "Sign up", "Contact")? → Enable it. Never create a separate text field for a link label.
2. **Variants** (`--variation Primary --variation Secondary`): does the source site show distinct button styles (e.g., filled vs. outline, primary vs. secondary CTA)? → Add variant options matching the observed styles. Never create a separate select field for button style.
3. **Repeat** (`--repeatable`): could this section ever have more than one link (e.g., "Learn More" + "Contact Us" side by side, or a list of navigation links)? → Enable it. Never create multiple link fields, and never create a group field whose only purpose is holding links.

A Link with all three features enabled (`--allow-text --repeatable --variation Primary --variation Secondary`) replaces what would otherwise require a group field with separate link + label + style sub-fields. Use the Link field's built-in capabilities instead.

**Navigation example:** A navigation menu is a list of labeled links. Model it as a single repeatable Link field with display text (`--allow-text --repeatable`), not as a Group field containing a Link sub-field. The Group-of-links pattern is an anti-pattern when the group items contain nothing besides a link.

## Page types

Represent URL-addressable pages. Include built-in SEO and UID fields. Built around slices in a slice zone, with an optional static zone for page-level fields.

- **Single**: one document only (homepage, contact page).
- **Reusable**: unlimited documents (blog posts, product pages).

## Custom types

Non-page content: navigation, settings, footers, author profiles, editor-managed taxonomies (categories, tags). Referenced by page types via content relationship fields.

Avoid slices in custom types. Use static zone fields and group fields. Exception: complex navigation (mega-menus).

## Slices

Reusable page sections. Content writers stack slices in a slice zone.

Each slice has a primary zone for fields (including group fields for repeated items) and one or more variations.

**Legacy note:** The secondary "repeatable zone" (items) is deprecated. Use group fields in the primary zone instead.

</prismic-building-blocks>

<guidelines label="Naming conventions">

- **Slice IDs**: PascalCase — `Hero`, `CallToAction`, `FeaturedContent`.
- **Variation IDs**: camelCase — `default`, `centered`, `withVideo`.
- **Field IDs**: consistent across slices. Use `heading` everywhere, not `title` in one slice and `heading` in another.
- **Type IDs**: snake_case — `blog_post`, `landing_page`, `settings`.
- **Type labels**: human-friendly — "Blog Post", "Landing Page", "Site Settings".
- Common field ID conventions: `heading`, `subheading`, `eyebrow`, `description`, `body`, `image`, `background_image`, `cta` (Link — enable display text, variants, and repeat as needed), `theme` (Select).

</guidelines>

<slice-design>

## Name slices by purpose, not layout

Prefer: "Hero", "Features", "Testimonials", "CallToAction", "FAQ", "Pricing".
Avoid: "TextWithImage", "ThreeColumnGrid", "AccordionList".
Exception: genuinely general-purpose blocks can use descriptive names ("MediaBlock").

## Keep slices focused

One slice, one job. Too many optional fields → split into separate slices.

## Use group fields for repeated content

Cards, team members, feature items, FAQ items — anything that repeats belongs in a group field, not numbered fields (`feature_1`, `feature_2`).

## Static zone for page-level fields only

Page title, meta description, featured image, publication date, author — these go in the static zone. Reusable content sections go in slices.

## Variations vs. separate slices

Variations are different layouts or field configurations of the same slice.

**Use a variation when:**
- Same purpose AND same core fields, just different layout or a small field difference.
- Example: Hero with image left vs. image right. CallToAction with or without a background image.

**Use a separate slice when:**
- Different purpose, even if fields overlap.
- A content writer would think of them as different things.
- Combining them would require many optional fields or confuse the author experience.

Default to separate slices when in doubt. It is easier to merge two slices into one later than to untangle a variation that should have been its own slice. Do not force variations just to reduce the slice count.

## Structuring variations

- Default variation = most common usage with core fields.
- Additional variations add or adjust fields relative to default.
- Fields with the same API ID across variations preserve content when switching.

</slice-design>

<anti-patterns>

## Overloading a slice with optional fields

If a slice looks very different depending on which optional fields are filled, or content writers need instructions on which fields to leave empty, split it into focused variations (if the purpose is the same) or separate slices (if the purposes differ).

## Forcing variations that should be separate slices

If the only thing two blocks share is a heading and description, that overlap is coincidental. They need separate slices, not variations. Ask: "would a content writer look for these under the same name?" If not, they are separate slices.

## Ignoring Link field features

Every `add-field link` command must reflect a deliberate decision on all three Link features: display text, variants, and repeat. Evaluate each feature against the source content and site design — enable it when the evidence supports it, leave it off when it doesn't apply. Common mistakes:

- Creating `cta_link` + `cta_label` as separate fields → use `--allow-text` on a single Link field.
- Creating a `cta_style` select field → use `--variation Primary --variation Secondary` on the Link field.
- Creating multiple link fields or a group field just for a list of CTAs → use `--repeatable` on a single Link field.
- Adding a Link field to a Hero or CallToAction slice without `--allow-text` → CTAs almost always need a label.
- Adding a CTA Link field without considering variants → check the source site for distinct button styles first.
- Adding a single CTA Link field without considering repeat → check if the source section ever has more than one CTA.

## Group field containing only links

If a Group field's items contain nothing besides a Link (or a Link + a plain-text label), the group is unnecessary. Use a single repeatable Link field with `--allow-text` instead. This is especially common for navigation menus, footer links, and social link lists.

Wrong: `add-field group navigation header_links` → `add-field link navigation header_links.link --allow-text`
Right: `add-field link navigation header_links --allow-text --repeatable`

## Slices in custom types

Custom types use static zone fields and group fields. Slices belong in page types.

## Numbered fields instead of groups

`feature_1_title`, `feature_2_title` → use a group field.

## Inconsistent field IDs

Pick one ID for each concept and use it everywhere: `heading` (not sometimes `title`), `cta` (not sometimes `button`).

## Deeply nested structures

Prismic slices are flat. If you need nested groups or complex hierarchies, split across slices or use a separate custom type.

</anti-patterns>