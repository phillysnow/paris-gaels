# Prismic Agentic Migration Starter

> **Full documentation:** [prismic.io/docs/migration#agentic-migration](https://prismic.io/docs/migration#agentic-migration)

This starter uses AI-powered agents to help you migrate content from your existing CMS (e.g. WordPress, Contentful, Storyblok) into Prismic. The agents run inside your AI coding tool (Cursor or Claude Code) and walk you through the process step by step.

## Prerequisites

- **Node.js** >= 20
- **Cursor** or **Claude Code** installed
- A **Prismic repository** ready to receive the migrated content

## Setup

```
npx @slicemachine/init@latest --starter agentic-migration-starter
```

## Running the Migration

Open this directory in Cursor or Claude Code, then run the three agents in order:

### 1. `/export-and-analyze`

Exports all content from your source CMS and analyzes both the content structure and your live website. The agent asks for your CMS credentials and website URL, then walks you through each phase.

### 2. `/bootstrap-models`

Reads the analysis outputs and uses the Prismic CLI to create custom types and slices for your Prismic repository. You can iterate on the models until you're satisfied, then push them from Slice Machine (`npm run slicemachine`).

### 3. `/script-migration`

Orchestrates the full migration: planning, script generation, per-type conversion with dry validation, test migration, human review, and full execution. The agent maintains a progress file so you can stop and resume at any time.

Review migrated content at: `https://your-repo-name.prismic.io/builder/migration`

## Project Structure

| Path             | Description                                                               |
| ---------------- | ------------------------------------------------------------------------- |
| `./export/`      | Exported content and analysis documents                                   |
| `./scripts/`     | Scripts written by the agents (including converters and migration runner) |
| `./migration/`   | Migration plan, progress tracker, state file, and per-type reports        |
| `./customtypes/` | Prismic custom type definitions                                           |
| `./slices/`      | Prismic slice definitions                                                 |
