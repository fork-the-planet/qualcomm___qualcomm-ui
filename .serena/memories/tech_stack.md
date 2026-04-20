# Tech Stack

## Runtime & Tooling
- **Node.js**: v24.x
- **Package Manager**: pnpm 10.x (enforced via `only-allow pnpm`)
- **Monorepo Orchestration**: Turborepo (`turbo`)
- **Language**: TypeScript 5.9 (strict mode)
- **Module System**: ES Modules (`"type": "module"`)

## Frameworks
- **React**: 19.x
- **Angular**: 21.x
- **React Router**: 7.x (for docs/SSR apps)

## Build
- **Bundler**: esbuild (via custom `build.ts` scripts using `tsx`)
- **TypeScript**: Composite project references with `tsc -b`

## Styling
- **Tailwind CSS**: v4.x with custom `@qualcomm-ui/tailwind-plugin`
- **Design Tokens**: CSS variables in `packages/common/qds-core/src/styles/`

## Testing
- **Test Runner**: Vitest 4.x
- **Browser Testing**: `@vitest/browser` + `@vitest/browser-playwright`
- **E2E**: Playwright 1.56.x

## Code Quality
- **Linting**: ESLint 9.x (flat config) with custom plugins
- **Formatting**: Prettier 3.x (no semis, double quotes, trailing commas)
- **Style Linting**: Stylelint

## Documentation
- **Format**: MDX
- **API Docs**: TypeDoc