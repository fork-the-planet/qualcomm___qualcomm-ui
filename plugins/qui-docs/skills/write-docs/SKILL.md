---
name: write-docs
description: Write or revise QUI Docs documentation. Use whenever Codex is creating, editing, restructuring, or expanding MDX route files, navigation entries, documentation links, examples, screenshots, or docs assets in packages/docs/qui-docs or any QUI Docs-based documentation site; also use when a user asks to author documentation, add a docs page, rewrite docs copy, or prepare documentation for a PR.
---

# Write Docs

Use this skill to produce QUI Docs pages that are useful before they are polished. Start from the reader's task, then apply the rules.

## Required Context

Read these shared references before making documentation changes:

- `.plugin-references/qui-docs/principles.md`
- `.plugin-references/qui-docs/rules.md`

If either shared reference is missing, stop and report that the `qui-docs` plugin cannot run because its shared authoring references are unavailable. Do not use fallback reference files.

## Workflow

1. Identify the page type before writing: task guide, workflow guide, capability reference, troubleshooting guide, concept page, field or state reference, recipe collection, or decision guide. Split the work if one page is trying to be several page types.
2. Open with reader value. The first paragraph must say what the reader can do, decide, verify, or troubleshoot after reading.
3. Use the standard page shell: frontmatter with `title`, then `# {frontmatter.title}`. Keep one H1 per page.
4. Structure H2 sections around reader tasks or topics. Use H3 and H4 only when they add real hierarchy.
5. Make prerequisites, access requirements, setup, steps, expected result, side effects, and failure modes explicit.
6. Use active voice, present tense, imperative steps, exact UI labels, field names, commands, statuses, file names, and root-relative links.
7. Use realistic examples. For API or CLI docs, include setup assumptions, a minimal working request, a successful response, at least one common error when relevant, and how returned identifiers are reused.
8. Add screenshots only when they clarify a state, dense table, or non-obvious control. Name, place, and describe screenshots according to the rules reference.
9. Update `qui-docs.config.ts` when route order, nesting, or visibility matters.
10. Before finishing, apply the review checklist from `.plugin-references/qui-docs/rules.md`. If code snippets cannot be run or compiled, say that explicitly.

## Avoid

- Do not create section `index.mdx` pages. Use `overview.mdx` only when it explains a section's purpose.
- Do not write screen tours that only describe visible controls.
- Do not add manual tables of contents, summary sections that repeat headings, `<br>` tags, inline `style` attributes, emojis, placeholder-only examples, vague link text, or relative docs links.
- Do not grow legacy mixed-case route or asset folders.
- Do not use banned openings such as `This page contains...`, `The below...`, or `This document explains...`.
