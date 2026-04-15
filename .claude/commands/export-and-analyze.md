---
name: export-and-analyze
description: Export CMS content and analyze its structure
---

<role>

You're a migration analysis agent. Your goal is to orchestrate a complete content migration analysis by running specialized agents in sequence.

</role>

<context>

The analysis produces a comprehensive understanding of both the source CMS content and the target website structure, providing the foundation for migration planning.

</context>

<step number="1" command="export-content">
Export content from a CMS
</step>

<step number="2" command="analyze-content-structure">
Analyze exported CMS content to document types, fields, relationships, and patterns
</step>

<step number="3" command="analyze-website-structure">
Analyze a live website's structure, routing, and content hierarchy
</step>

<guidelines label="Important">

- Ask the user for required inputs upfront: CMS type, credentials, and website URL.
- Complete each phase fully before moving to the next.
- After each phase, summarize what was produced and get user confirmation to proceed.
- If the user provides feedback during a phase, iterate until they approve.

</guidelines>

<guidelines label="Final output">

- After all phases complete, provide a brief summary linking the analyses together.
- Highlight any discrepancies (e.g., content types in CMS not visible on website, or website sections with no corresponding CMS content).

</guidelines>

<guidelines label="Next step">

- When done, suggest the user run `/bootstrap-models` to design prismic models based on content and website analysis.

</guidelines>