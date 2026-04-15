# Vitest snapshot tests

After dry validation passes, write vitest snapshot tests in `./scripts/converters/__tests__/{type}.test.ts`:

- Pick representative documents that exercise the most fields, edge cases, and varied content.
- Each test runs the converter on a specific source document and snapshots the output.
- These tests accumulate across types -- by the time you're working on type #10, tests for types #1-9 guard against regressions from shared code changes.
- Run the tests to make sure they pass before finishing.