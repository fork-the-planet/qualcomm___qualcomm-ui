# Task Completion Checklist

When completing a task in this repository, ensure the following:

## Before Committing
1. **Build**: Run `pnpm build` (or the relevant subset like `pnpm build:react`) to verify the build passes.
2. **Lint**: Run `pnpm lint` to check for linting errors.
3. **Test**: Run the relevant test suite:
   - React: `pnpm react test` and/or `pnpm react-core test`
   - Angular: `pnpm angular-core test` (if applicable)
   - All: `pnpm test`
4. **Type Check**: TypeScript errors are caught during build (`tsc -b`).

## Code Quality
- Ensure no redundant comments
- Follow Prettier formatting (no semis, double quotes, trailing commas, no bracket spacing)
- Follow existing patterns in the codebase
- Ensure backward compatibility or update all references

## Component Changes
- If modifying core logic: verify both React and Angular bindings still work
- If adding a new component: follow the layered architecture (core → framework-core → framework)
- If modifying design tokens: check impact across themes/brands

## Documentation Changes
- Demo components should be self-contained
- MDX documentation should follow existing tone and style