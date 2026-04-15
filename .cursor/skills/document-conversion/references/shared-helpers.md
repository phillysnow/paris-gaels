# Shared helpers

If you notice repeated transformation patterns across types (e.g. converting WordPress taxonomies, mapping Storyblok bloks to slices, date format normalization, slug generation), extract them into `./scripts/converters/helpers/` for reuse. Don't pre-engineer helpers -- create them when you see the pattern repeat.