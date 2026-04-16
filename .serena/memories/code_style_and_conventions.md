# Code Style and Conventions

## TypeScript
- Strict mode enabled globally
- ES2022 target and lib
- `nodenext` module resolution
- Composite project references for incremental builds
- Node.js modules must be prefixed with `node:` (e.g., `node:fs/promises`)
- Named imports preferred
- Async/promises preferred over synchronous equivalents

## Prettier Configuration
- **No semicolons** (`semi: false`)
- **Double quotes** (`singleQuote: false`)
- **Trailing commas**: all
- **Print width**: 80
- **Bracket spacing**: false (e.g., `{foo}` not `{ foo }`)
- **JSX quotes**: double
- **Tailwind plugin** enabled

## ESLint
- Flat config (ESLint 9.x)
- Custom ESLint configs and plugins in `packages/configs/`
- Angular, React, MDX, and TypeScript-specific rule sets
- Gradually adopting stricter performance-focused configs

## File/Directory Organization
- Each component gets its own directory within its package's `src/`
- Each component directory has an `index.ts` barrel export
- Package exports use subpath pattern: `@qualcomm-ui/react/<component>`

## Comments
- Avoid redundant comments that restate obvious code
- Keep JSDoc documentation comments
- Only add comments for business logic, edge cases, or non-obvious behavior

## Testing
- Vitest with browser-based testing (Playwright)
- Tests colocated with source code (`.spec.ts` / `.test.tsx` files)
- React tests use a specialized `react-test-utils` package

## Component Architecture
- Headless core logic (state machines) in `packages/common/core`
- Framework bindings in `packages/frameworks/<framework>-core`
- Styled/themed components in `packages/frameworks/<framework>`
- QDS design tokens separate from component logic