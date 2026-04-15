---
name: project-structure
description: Defines canonical project document paths and markdown templates for migration artifacts. Use when an agent or skill needs to create or update project documentation files.
---

<usage>

Use this skill whenever you need to write a project document.

Workflow:
1. Pick the artifact key in the `Document paths` section of this skill.
2. Write to the mapped canonical path.
3. Follow the matching template reference for structure and headings.

</usage>

<guidelines label="Writing documents">

- Keep headings and section names aligned with the selected template.
- Keep content concise and evidence-based.
- When using ASCII diagrams, keep them simple and avoid complex characters. Prefer characters like `-=+_><[]|/\@$~`.

</guidelines>

<document-paths>

# Document paths

Use these artifact keys and canonical paths:

- `content-export` -> `./export/{cms}/content-export.md`
- `content-analysis` -> `./export/content-analysis.md`
- `website-analysis` -> `./export/website-analysis.md`
- `content-modeling` -> `./export/content-modeling.md`
- `migration-plan` -> `./migration/migration-plan.md`
- `migration-script` -> `./migration/migration-script.md`
- `migration-progress` -> `./migration/migration-progress.md`
- `document-conversion-report` -> `./migration/document-conversion-{type}.md`

</document-paths>