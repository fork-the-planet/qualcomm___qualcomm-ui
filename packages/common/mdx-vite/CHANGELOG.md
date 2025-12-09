# @qualcomm-ui/mdx-vite

## 2.6.0 (2025/12/08)

### Features

- [docs]: add git-derived updated metadata to pages
- [docs]: populate page updatedOn/updatedBy from git history

### Tests

- [docs]: mock git child_process calls in docs indexer specs

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 2.5.4 (2025/12/05)

### Bug Fixes

- [knowledge]: ensure updated files are re-indexed

## 2.5.3 (2025/12/04)

### Bug Fixes

- [knowledge]: improve duplicate detection and retry handling
- [knowledge]: avoid reuploading unchanged knowledge files
- [knowledge]: stop persisting debug file dump
- [knowledge]: resolve optional theme data and emit json blocks
- [knowledge]: return failure when file update fails
- [knowledge]: clean orphaned files before upload
- [knowledge]: prevent duplicate file uploads
- [knowledge]: refactor api client to avoid duplicates

### Code Refactoring

- [open-web-ui]: introduce typed files/knowledge api client
- [knowledge]: migrate upload/download to new api layer

### Miscellaneous Chores

- [knowledge]: add cleaner for orphaned and failed files

## 2.5.2 (2025/12/04)

### Code Refactoring

- [knowledge-config]: remove knowledgeId requirement from generation command
- [generate-knowledge]: reorganize functions into class for shared state/config

### Bug Fixes

- [knowledge-upload]: more resilient duplication handling
- [generate-knowledge]: remove links in aggregate output mode
- [knowledge-upload]: do not retry upload after specific errors

## 2.5.1 (2025/12/03)

### Bug Fixes

- [llms-txt-generator]: use correct urls for intro page overview

## 2.5.0 (2025/12/03)

### Features

- [docs-plugin]: add toc change tracking to file metadata

### Bug Fixes

- [docs-plugin]: add back site data invalidation on mdx file change

## 2.4.0 (2025/12/03)

### Features

- [mdx-vite]: add transformation from tailwind to inline styles in demos
- [shiki]: add data-code and data-preview attributes to highlighted demo html
- [preview-blocks]: strip code annotations from preview content

### Code Refactoring

- [code-highlighting]: simplified internal highlighted code data structures

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]

## 2.3.0 (2025/12/01)

### Features

- [knowledge-generator]: formatting enhancements for aggregated output mode

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils]

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
