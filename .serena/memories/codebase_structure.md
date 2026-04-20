# Codebase Structure

```
qualcomm-ui/
├── packages/
│   ├── common/                    # Framework-agnostic shared code
│   │   ├── core/                  # State machines, business logic, a11y
│   │   ├── dom/                   # DOM abstractions
│   │   ├── utils/                 # Generic utilities
│   │   ├── qds-core/              # Design tokens, themes, brand styles
│   │   ├── tailwind-plugin/       # Tailwind CSS plugin
│   │   ├── mdx-common/            # Shared MDX utilities
│   │   ├── mdx-vite/              # MDX Vite plugin
│   │   ├── node-utils/            # Node.js utilities
│   │   ├── typedoc/               # TypeDoc configuration
│   │   └── typedoc-common/        # Shared TypeDoc utilities
│   │
│   ├── frameworks/                # Framework-specific implementations
│   │   ├── react-core/            # React headless hooks/bindings
│   │   ├── react/                 # React + QDS styled components
│   │   ├── react-internal/        # Internal React utilities
│   │   ├── react-mdx/             # React MDX components
│   │   ├── react-swagger/         # React Swagger integration
│   │   ├── react-router-utils/    # React Router utilities
│   │   ├── react-test-utils/      # React testing utilities
│   │   ├── angular-core/          # Angular headless bindings
│   │   └── angular/               # Angular + QDS styled components
│   │
│   ├── docs/                      # Documentation sites
│   │   ├── react-docs/            # React component docs
│   │   ├── angular-docs/          # Angular component docs
│   │   ├── qui-docs/              # Main QUI documentation site
│   │   ├── qui-site/              # QUI marketing/landing site
│   │   ├── react-table-docs/      # React table docs
│   │   └── angular-table-docs/    # Angular table docs
│   │
│   ├── configs/                   # Shared ESLint configs and plugins
│   │   ├── eslint-config-*/       # ESLint shared configs
│   │   └── eslint-plugin-*/       # ESLint custom plugins
│   │
│   └── debug-apps/                # Debug/development apps
│       ├── angular-csr/           # Angular client-side rendering
│       ├── angular-ssr/           # Angular server-side rendering
│       └── react-ssr/             # React server-side rendering
│
├── scripts/                       # Build and utility scripts
├── assets/                        # Static assets (architecture diagrams, etc.)
├── dockerfiles/                   # Docker configurations
├── patches/                       # Patch files for dependencies
├── turbo.json                     # Turborepo configuration
├── pnpm-workspace.yaml            # pnpm workspace definition
├── eslint.config.js               # Root ESLint flat config
├── prettier.config.js             # Prettier configuration
├── tsconfig.json                  # Root TypeScript config
└── tailwind.css                   # Root Tailwind CSS
```

## Documentation Layout
- Component docs: `packages/docs/<framework>/src/routes/components+/<component>+/_<component>.mdx`
- Demo components: `packages/docs/<framework>/src/routes/components+/<component>+/demos/*.tsx`
- Design tokens: `packages/common/qds-core/src/styles/` (use `qualcomm-dark.css` as reference)