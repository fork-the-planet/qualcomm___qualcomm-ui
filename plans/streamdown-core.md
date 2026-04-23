# Cross-Platform Streamdown Core Layer

## Context

We need streaming markdown rendering for both React and Angular. The `assistant-ui/react-streamdown` package wraps the `streamdown` npm library (React-only) for AI-powered streaming markdown. We want a cross-platform core layer that fits qualcomm-ui's existing architecture (`core` / `react-core` / `angular-core`).

We can take a dependency on `streamdown` and its underlying libraries. QDS already has all the interactive UI components (code blocks, tables, copy buttons, etc.) for both frameworks.

## Architecture

### Core Layer

Owns the markdown-to-HAST pipeline using the same libraries streamdown uses internally. All framework-agnostic.

**Dependencies** (all framework-agnostic):
- `remark-parse` + `remark-gfm` — markdown string → MDAST
- `remark-rehype` — MDAST → HAST
- `rehype-sanitize`, `rehype-raw`, `rehype-harden` — HAST security transforms
- `remend` — incomplete markdown auto-completion for streaming

**Responsibilities:**
- **Block splitting**: Split markdown on `\n\n` boundaries (same as `parseMarkdownIntoBlocks`)
- **Remend**: Run incomplete markdown completion on the active (last) block during streaming
- **Remark/rehype pipeline**: Process each block → produce sanitized HAST tree per block
- **Block-level HAST caching**: `Map<string, HastNode>` keyed by block content string. If block text hasn't changed, skip reprocessing. This is the cross-platform memoization.
- **Streaming state machine**: Using `createMachine`/`bindable` pattern. States: `idle → running → complete → error`. Exposes `isAnimating`, `status`, active block index.
- **Config processing**: Plugin merging, security config assembly, remend config
- **Shared types**: `PluginConfig`, `SecurityConfig`, `RemendConfig`, `ControlsConfig`, `CaretStyle`, etc.

**Output**: A sanitized HAST tree per block. Framework adapters decide how to render it.

### HAST as Universal IR

HAST (Hypertext Abstract Syntax Tree) is a tree, not HTML. Each node is:

```ts
{ type: 'element', tagName: 'pre', properties: {...}, children: [...] }
```

The core layer produces it. Each framework adapter walks it differently.

### React Adapter

**HAST → QDS React components** via `hast-util-to-jsx-runtime`.

This library walks the HAST tree and creates React elements. It accepts a `components` map that swaps HTML tag names for QDS components:

```ts
const components = {
  pre: QDSCodeBlock,
  table: QDSTable,
  a: QDSLink,
  // plain HTML tags render as-is
}

toJsxRuntime(hast, { Fragment, jsx, jsxs, components })
```

When the walker hits a `<pre>` HAST node, it creates `React.createElement(QDSCodeBlock, props)` instead of a plain `<pre>`.

React-specific memoization on top of core's block cache:
- `React.memo` with custom comparators on the block renderer component
- `useMemo` for derived config values

### Angular Adapter

**HAST → QDS Angular components** via a recursive `HastRenderer` component with `@switch`:

```html
@for (child of node.children; track $index) {
  @switch (child.tagName) {
    @case ('pre') {
      <qui-code-block [code]="extractCode(child)" [language]="extractLang(child)" />
    }
    @case ('table') {
      <qui-table>...</qui-table>
    }
    @default {
      <hast-renderer [node]="child" />
    }
  }
}
```

AOT-safe — all component references are statically declared in the template. The recursive `<hast-renderer>` handles the tree walk.

**Default case (plain HTML nodes)**: Angular can't dynamically choose HTML tag names in templates. Hybrid approach:
- Serialize subtrees with no QDS components to HTML via `hast-util-to-html` and bind with `[innerHTML]`
- Safe because the HAST is already sanitized by rehype-sanitize/harden in the core layer
- Only interactive nodes (pre, table, a) get promoted to real QDS Angular components

Angular-specific memoization: `computed()` signals on top of core's cached HAST output.

## Effort Estimate

| Layer | Effort |
|-------|--------|
| Core pipeline (remark/rehype wiring, block cache, streaming machine, config) | ~2 days |
| React adapter (hast-util-to-jsx-runtime + QDS component map) | ~1 day |
| Angular adapter (recursive HastRenderer + QDS mapping) | ~1-2 days |
| **Total** | **~3-5 days** |

## Open Questions

1. **Plugin system**: Should the core layer support streamdown's plugin architecture (@streamdown/code, @streamdown/math, @streamdown/mermaid), or handle syntax highlighting / math / diagrams through QDS components directly?
2. **Caret animation**: Streamdown handles this in React. Do we need a streaming cursor indicator, and if so, should it be a core concern or per-framework?
3. **Package location**: New package under `packages/common/streamdown-core`? Or extend existing `packages/common/core`?
