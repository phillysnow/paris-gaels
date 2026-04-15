# Model gap detection

During conversion, you may discover that the Prismic models don't fully cover the source content. When this happens, do NOT silently skip content or force it into the wrong field/slice. Instead, collect these gaps and report them as actionable decisions:

- **Missing slices**: source content has a section with no corresponding slice in the Prismic model.
- **Missing fields**: a slice or type is missing a field that the source content uses.
- **Wrong field types**: a field exists but its type doesn't match what the source data needs.
- **Content that doesn't fit**: source content that can't be reasonably mapped to any existing model element.

For each gap, report: what source content is affected, how many documents have this issue, and a recommended fix (add a slice, add a field, change a field type). The orchestrator will present these to the user.