# Dry validation

After writing the converter, validate it before presenting results. Dry validation runs locally against exported content -- it does NOT call the Prismic API.

1. Run the converter against ALL exported documents of this type (not just a sample).
2. For each converted document, validate: required fields are present, field types match the Prismic model, UIDs are unique, relationships reference valid types.
3. **Check for empty output**: if a converter produces a document with no content in its slice zone or with most fields empty, treat it as a conversion error.
4. **Check for raw HTML in text fields**: if any plain text (key text) field contains HTML tags, the converter has a bug.
5. **StructuredText node type validation**: for every StructuredText (rich text) field in the output, verify that the node types used (heading1, heading2, paragraph, list-item, etc.) are allowed by the field's `single` or `multi` config in the Prismic model JSON. Downgrade disallowed node types.
6. **Asset URL preflight**: verify that all asset URLs are reachable (HTTP HEAD request, checking for 200 status). Log warnings for any unreachable URLs and either skip the asset or substitute a placeholder.
7. **Field coverage report**: for every field in the Prismic model for this type, calculate what percentage of documents have a non-empty value. Fields at 0% are almost certainly missed mappings.
8. If any documents fail, analyze the errors, fix the converter, and re-validate.
9. Repeat until the converter handles the full dataset cleanly.
10. If certain issues can't be auto-resolved, note them in the report.