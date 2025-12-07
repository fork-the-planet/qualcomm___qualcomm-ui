# ESLint Plugin Expansion - Complete

## Summary

The `@qualcomm-ui/eslint-plugin-react` has been expanded with 2 new rules and converted to TypeScript.

### Rules

| Rule | Description | Status |
|------|-------------|--------|
| `accessible-name` | Requires aria-label on IconButton, InlineIconButton, HeaderBarActionIconButton, Avatar | Extended |
| `icon-decorative` | Requires aria-hidden="true" or aria-label on Icon components | **New** |
| `input-label-association` | Requires proper labeling on form inputs (TextInput, Select, etc.) | **New** |

### Test Coverage
- **77 tests total** (all passing)
- `accessible-name`: 29 tests
- `icon-decorative`: 16 tests
- `input-label-association`: 32 tests

## File Structure

```
packages/configs/eslint-plugin-react/
├── src/
│   ├── index.ts           # Main export
│   ├── plugin.ts          # Plugin & config definition
│   └── rules/
│       ├── index.ts       # Rule exports
│       ├── utils.ts       # Shared utilities
│       ├── accessible-name.ts
│       ├── icon-decorative.ts
│       └── input-label-association.ts
├── tests/
│   ├── accessible-name.spec.ts
│   ├── icon-decorative.spec.ts
│   └── input-label-association.spec.ts
├── dist/                  # Compiled output (generated)
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vitest.config.ts
```

## Build Commands

```bash
pnpm build           # Compile TypeScript to dist/
pnpm build:watch     # Watch mode compilation
pnpm test            # Build and run tests
pnpm clean           # Remove dist/
```

## Usage

```js
// eslint.config.js
import {config} from "@qualcomm-ui/eslint-plugin-react"

export default [
  ...config,  // Enables all rules with "error" severity
]

// Or configure individually:
import {plugin} from "@qualcomm-ui/eslint-plugin-react"

export default [
  {
    plugins: {"@qualcomm-ui/react": plugin},
    rules: {
      "@qualcomm-ui/react/accessible-name": "error",
      "@qualcomm-ui/react/icon-decorative": "warn",
      "@qualcomm-ui/react/input-label-association": "error",
    }
  }
]
```
