---
name: review-docs
description: Review QUI Docs documentation for authoring compliance. Use whenever Codex is reviewing, proofreading, auditing, final-checking, or preparing to submit MDX route files, navigation entries, documentation links, examples, screenshots, or docs assets in packages/docs/qui-docs or any QUI Docs-based documentation site; also use as the final quality pass after writing or revising QUI Docs documentation.
---

# Review Docs

Use this skill to review documentation changes as a docs reviewer. Prioritize issues that block merge or make the page unusable for a new developer.

## Required Context

Read these shared references before reviewing documentation changes:

- `.plugin-references/qui-docs/principles.md`
- `.plugin-references/qui-docs/rules.md`

If either shared reference is missing, stop and report that the `qui-docs` plugin cannot run because its shared authoring references are unavailable. Do not use fallback reference files.

## Review Workflow

1. Identify the files under review: MDX route files, `qui-docs.config.ts`, links, examples, screenshots, and docs assets.
2. Determine the intended page type for each page. Flag pages that mix unrelated page types or read as screen tours.
3. Check merge blockers first: missing reader value, hidden prerequisites, placeholder examples, screenshot-only content, stale links, missing redirects after moves, broken frontmatter or H1, and unverified snippets.
4. Check structural rules: route names, asset names, no section `index.mdx`, frontmatter `title`, `# {frontmatter.title}`, heading hierarchy, no manual ToC, no weak headings, and navigation config alignment.
5. Check writing quality: active voice, present tense, direct nouns, imperative procedures, canonical terminology, no chat shorthand, no emojis, no vague internal phrasing, and no banned opening phrases.
6. Check examples and screenshots: realistic values, runnable snippets, expected results, common errors, useful alt text, lowercase PNG filenames, and screenshots that support nearby text.
7. When feasible, run or compile code snippets touched by the change. If that is not feasible, list snippet verification as residual risk.

## Output

Lead with findings ordered by severity. Include file and line references for every actionable issue.

Use this shape:

```text
Findings
- [P1] <issue>. <file:line>
  <why it matters and what to change>

Open Questions
- <only if needed>

Residual Risk
- <unverified snippets, links not checked in a running dev server, or other limits>
```

If there are no issues, say that clearly and include any remaining verification gaps.
