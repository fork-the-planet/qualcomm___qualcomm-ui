# @qualcomm-ui/react-mdx

## 1.7.2 (2025/12/11)

### Bug Fixes

- [docs-layout]: fix header light-mode background-color

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react, @qualcomm-ui/core, @qualcomm-ui/react-core]

## 1.7.1 (2025/12/10)

### Bug Fixes

- [typedoc-descriptions]: Link size matches font size

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/react, @qualcomm-ui/react-core, @qualcomm-ui/utils]

## 1.7.0 (2025/12/08)

### Features

- [docs-layout]: add last updated metadata display

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 1.6.3 (2025/12/08)

### Bug Fixes

- [a11y]: add aria labels to interactive controls

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/react]

## 1.6.2 (2025/12/05)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.6.1 (2025/12/03)

### Code Refactoring

- [demo-source-code]: consolidate copyable code functionality

### Bug Fixes

- [copy-to-clipboard-button]: use correct positioning in type popup
- [angular-demo-runner]: fix copy-to-clipboard action

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.6.0 (2025/12/03)

### Features

- [angular-demo]: add inline style toggle
- [react-demo]: add inline style toggle

### Code Refactoring

- [demos]: consolidate react and angular demo logic
- [demos]: deprecate QdsAngularDemoRunner in favor of new AngularDemoRunner (same interface)

### Miscellaneous

- fix demo code panel: always render so copy function works everywhere

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/core, @qualcomm-ui/react, @qualcomm-ui/utils, @qualcomm-ui/react-core]

## 1.5.9 (2025/12/01)

### Bug Fixes

- [mdx-tables]: add box-sizing to prevent 2px overflow at full width
- [shiki-notation-styles]: highlighted line indent color clash
- [npm-install-tabs]: corrected language from bash to shell
- [shiki-notation]: reduce opacity of warning and error backgrounds for contrast accessibility compliance

### Styles

- [mdx-tables]: reduced size from `md` to `sm`

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils, @qualcomm-ui/react, @qualcomm-ui/react-core, @qualcomm-ui/core]

## 1.5.8 (2025/12/01)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.5.7 (2025/12/01)

### Bug Fixes

- [docs-layout]: prevent crash when path segment missing

## 1.5.6 (2025/12/01)

### Bug Fixes

- [site-search]: prevent firefox search input hiding on mouseup

## 1.5.5 (2025/11/30)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.5.4 (2025/11/30)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.5.3 (2025/11/25)

### Bug Fixes

- [react-demo]: guard for missing demo data

## 1.5.2 (2025/11/25)

### Bug Fixes

- [shiki-diff-notation]: reduce opacity of removal diff
- [qds-demo-runner]: account for adjusted demo interface

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react, @qualcomm-ui/mdx-common, @qualcomm-ui/core, @qualcomm-ui/react-core]

## 1.5.1 (2025/11/24)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.5.0 (2025/11/21)

### Features

- [qui-ecosystem]: add qui-docs link

### Bug Fixes

- [site-search]: increase text-input right margin

## 1.4.0 (2025/11/21)

### Features

- [shiki]: add error/warning notation styles
- [shiki]: add word highlight styles
- [mdx-docs-context]: expand ssrUserAgent type to include null
- [shiki]: add focus notation styles
- [shiki styles]: add line highlight, diff styles for shiki transformers

### Bug Fixes

- [sidebar, header]: use correct background in light mode
- [mdx-css]: add top margin to qui-tabs\_\_root in mdx
- [code-tabs]: remove margin from child shiki blocks
- [sidebar]: expand parent node when pathname changes to a hidden child node

### Miscellaneous Chores

- migrate change-case to @qualcomm-ui/utils/change-case
- **deps:** update dependencies [@qualcomm-ui/react, @qualcomm-ui/core, @qualcomm-ui/mdx-common, @qualcomm-ui/utils, @qualcomm-ui/react-core]

## 1.3.0 (2025/11/19)

### Features

- [Demos]: add ReactDemo and ReactDemoRunner components

### Code Refactoring

- [Demos]: deprecate QdsReactDemo and QdsDemoRunner

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/react]

## 1.2.3 (2025/11/18)

### Build System

- do not minify identifiers

### Miscellaneous Chores

- [dependencies]: omit all devDependencies from build
- **deps:** update dependencies [@qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.2.2 (2025/11/18)

### Bug Fixes

- [typedoc-descriptions]: use qui link component

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.2.1 (2025/11/17)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.2.0 (2025/11/17)

### Features

- [PageLinks]: show adjacent page path segment prefix when it differs from current page path segment prefix

### Bug Fixes

- [site-search]: open dialog when input is focused
- [site-search]: prevent match highlight when query length is < 2

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/core, @qualcomm-ui/react-core, @qualcomm-ui/react]

## 1.1.0 (2025/11/14)

### Features

- add text-input to site-search
- add github custom lucide-icon

### Bug Fixes

- sidebar branch node link behavior restored, but deprecated
- mdx table min-width extends to content
- fix search activation keyboard shortcut
- stricter dependency on workspace packages to ensure paired version bumps
- prevent breadcrumbs list key dupe

### Code Refactoring

- remove react-device-detect dependency

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react-core, @qualcomm-ui/react, @qualcomm-ui/core, @qualcomm-ui/mdx-common, @qualcomm-ui/utils]

## 1.0.4 (2025/11/14)

### Bug Fixes

- element preflight styles
- shiki inner html padding

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.0.3 (2025/11/13)

### Bug Fixes

- add stub ts files for npm ts badge

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/mdx-common, @qualcomm-ui/utils, @qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.0.2 (2025/11/12)

### Bug Fixes

- react readme url

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/mdx-common, @qualcomm-ui/utils, @qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.0.1 (2025/11/12)

### Miscellaneous Chores

- add missing package licenses
- add per-package readmes
- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/mdx-common, @qualcomm-ui/utils, @qualcomm-ui/react, @qualcomm-ui/react-core]
