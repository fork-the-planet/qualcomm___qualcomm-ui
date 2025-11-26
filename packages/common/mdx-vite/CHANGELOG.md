# @qualcomm-ui/mdx-vite

## 2.2.1 (2025/11/25)

### Bug Fixes

- [rag-knowledge-generator]: apply exclude CLI option to filenames

## 2.2.0 (2025/11/25)

### Features

- [angular-demo-plugin]: add common transformers
- [shiki]: add transformer-notation-hidden transformer
- [shiki]: add preview display modes, onComplete hook, and dedent support to preview block transformer
- [shiki]: improve removeCodeAnnotations to handle JSX block markers and cleanup blank lines
- [angular-demo-plugin]: enhance code extraction to account for shiki annotations

### Code Refactoring

- [rag-knowledge-generator]: replace JSX regex with AST traversal
- [react-demo-plugin]: extract highlighted code handling into helper and reuse for imported files
- [angular-demo-plugin]: remove unused page modules
- [react-demo-plugin]: centralize Shiki options and return structured highlight metadata
- [mdx-common]: relax SourceCodeData shape and deprecate withoutImports field
- [react-demo-plugin]: use Shiki transformers for preview extraction instead of manual HTML parsing
- [shiki]: add completion callback to code attribute transformer

### Bug Fixes

- [rag-knowledge-generator]: use entire path in filename to fix collisions
- [docs-plugin]: adjust virtual module invalidation to prevent react-router hmr conflicts
- [angular-demo-plugin]: recovery gracefully on stat failure

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 2.1.3 (2025/11/23)

### Performance Improvements

- [angular-demo-plugin]: remove redundant module invalidation

### Bug Fixes

- [angular-demo-plugin]: relative file changes trigger demo update

## 2.1.2 (2025/11/21)

### Bug Fixes

- [docs-plugin]: add css HMR

## 2.1.1 (2025/11/21)

### Bug Fixes

- [owui-knowledge]: remove unused jsx from parsed mdx

## 2.1.0 (2025/11/21)

### Features

- [docs-plugin]: enable common shiki transformers by default
- [react-demo-plugin]: enable common shiki transformers
- [docs-plugin]: add initial shiki-preview-blocks transformer
- [docs-plugin]: add shiki-transformer-code-attribute

### Bug Fixes

- restrict plugin scope to avoid duplicate init
- [docs-plugin]: trigger full reload on frontmatter/config changes
- force reload module when mdx changes to update toc
- [plugin-hmr]: only invalidate associated modules

### Miscellaneous Chores

- [remark-code-tabs]: update jsdoc comment with example
- migrate change-case to @qualcomm-ui/utils/change-case
- remove legacy object key in test config
- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]

## 2.0.0 (2025/11/19)

### BREAKING CHANGES

- [react-demo-plugin]: plugin scope reduced to syntax highlighting for demo files

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 1.1.0 (2025/11/17)

### Features

- [search]: add rich text metadata to search index

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 1.0.3 (2025/11/13)

### Bug Fixes

- add stub ts files for npm ts badge

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]

## 1.0.2 (2025/11/12)

### Bug Fixes

- react readme url

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]

## 1.0.1 (2025/11/12)

### Miscellaneous Chores

- add missing package licenses
- add per-package readmes
- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]
