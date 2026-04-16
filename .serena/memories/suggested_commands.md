# Suggested Commands

## Install
```bash
pnpm install
```

## Build
```bash
pnpm build              # Build all library packages (excludes docs and debug apps)
pnpm build:react        # Build React packages only (excludes Angular)
pnpm build:docs         # Build documentation sites
```

## Dev (Watch Mode)
```bash
pnpm dev                # Dev mode for all library packages
pnpm dev:react          # Dev mode for React packages
pnpm dev:angular        # Dev mode for Angular packages
```

## Running Specific Packages
Package aliases are defined in root `package.json`. Use:
```bash
pnpm react-docs dev     # Run React docs dev server
pnpm angular-docs dev   # Run Angular docs dev server
pnpm react dev          # Dev mode for @qualcomm-ui/react
pnpm react-core dev     # Dev mode for @qualcomm-ui/react-core
pnpm angular dev        # Dev mode for @qualcomm-ui/angular
pnpm core dev           # Dev mode for @qualcomm-ui/core
pnpm react-ssr dev      # Run React SSR debug app
```

## Testing
```bash
pnpm test                    # Run all tests via turbo
pnpm react test              # Tests for @qualcomm-ui/react
pnpm react-core test         # Tests for @qualcomm-ui/react-core
pnpm react test:watch        # Watch mode tests for @qualcomm-ui/react
pnpm react-core test:watch   # Watch mode tests for @qualcomm-ui/react-core
pnpm angular-core test       # Tests for @qualcomm-ui/angular-core (if available)
```

## Linting & Formatting
```bash
pnpm lint                # Run ESLint across all packages
```
Prettier is configured but typically runs via editor integration or pre-commit hooks.

## TypeDoc / API Docs
```bash
pnpm doc-gen             # Generate TypeDoc API docs
```

## Publishing
```bash
pnpm bump                # Prepare release (changesets)
pnpm publish:all         # Publish all packages
```

## Utility
```bash
pnpm clean-tsbuildinfo   # Remove TypeScript build caches
pnpm force-clean         # Remove all dist directories
```