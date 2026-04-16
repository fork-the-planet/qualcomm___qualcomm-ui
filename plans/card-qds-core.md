# Card QDS Core Layer Implementation Plan

## Summary

Create a `card` module in `packages/common/qds-core/src/card/` following the established pattern (classes, types, api, css, index). The card is a **static, composable container** — subcomponents like Badge, Button, Divider, and Avatar are **not** included. Users compose them freely within card parts.

## Card Parts

Based on the Figma design, the card has these structural parts:

| Part | CSS Class | Purpose |
|------|-----------|---------|
| **Root** | `qui-card__root` | Outer container — surface color, border, radius, overflow clip |
| **Media** | `qui-card__media` | Top media area (user places avatars, images, etc.) |
| **Header** | `qui-card__header` | Title row within content area (heading + optional action slot) |
| **Body** | `qui-card__body` | Main text/content area |
| **Footer** | `qui-card__footer` | Bottom action bar (user places buttons, links, etc.) |

## Variant Properties

From the Figma component:

| Property | Type | Values | Default |
|----------|------|--------|---------|
| `variant` | `QdsCardVariant` | `"outline"` | `"outline"` |
| `size` | `QdsCardSize` | `"sm"` | `"sm"` |

Note: The Figma design only shows `outline`/`sm` for now, but the types will be defined so new values can be added later.

## Files to Create

### 1. `packages/common/qds-core/src/card/card.classes.ts`

```ts
export const cardClasses = {
  root: "qui-card__root",
  media: "qui-card__media",
  header: "qui-card__header",
  body: "qui-card__body",
  footer: "qui-card__footer",
} as const
```

### 2. `packages/common/qds-core/src/card/card.types.ts`

Defines:
- `QdsCardVariant` — `"outline"`
- `QdsCardSize` — `"sm"`
- `QdsCardApiProps` — `{ variant?, size? }`
- Bindings interfaces for each part (`QdsCardRootBindings`, `QdsCardMediaBindings`, etc.)
- `QdsCardApi` — the API interface with `getXBindings()` methods

Each bindings interface returns its class name + relevant `data-*` attributes (e.g., `data-variant`, `data-size`).

### 3. `packages/common/qds-core/src/card/card.api.ts`

`createQdsCardApi(props, normalize)` → returns a `QdsCardApi` with binding getters for each part, following the exact pattern from dialog.api.ts.

### 4. `packages/common/qds-core/src/card/qds-card.css`

Styles for all card parts using design tokens from the theme:
- **Root**: `--color-surface-raised` background, `--color-border-neutral-01` border, `--border-radius-md` radius, overflow clip, flex column layout
- **Media**: Centered content area, neutral background, relative positioning for badge overlays
- **Header**: Flex row, heading typography (`--font-static-body-md-bold`), space between for action slot
- **Body**: Flex column, body typography (`--font-static-body-xs-default`), secondary text color
- **Footer**: Top border separator, right-aligned content, padding

All size-dependent values will be driven via `data-size` selectors on each part.

### 5. `packages/common/qds-core/src/card/index.ts`

Standard barrel export:
```ts
export * from "./card.api"
export * from "./card.classes"
export type * from "./card.types"
```

## No Changes Needed

- **`qui-css-utils.config.ts`** — The glob `src/**/qds-*.css` will automatically pick up `qds-card.css`
- **`package.json` exports** — The wildcard `./*` pattern already covers `./card`

## Key Design Decisions

1. **No state machine**: Card is purely presentational — no interactive state to manage. The QDS core API is sufficient.
2. **Parts are slots, not opinionated**: `media`, `header`, `body`, and `footer` provide styled containers. The user decides what goes inside them.
3. **Follows dialog pattern**: Dialog is the closest analog — a multi-part container with size/emphasis variants and binding getters per part.