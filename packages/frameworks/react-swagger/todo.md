# React Swagger Migration Todo

## Overview

Migrate legacy QUI components (`@qui/react`, `@qui/base`) to modern QUI components (`@qualcomm-ui/react`).

---

## Pre-Migration

- [ ] Check updated source code for changes
  - Source location: `/home/rbower/code/swagger-ui/src`
  - Compare each react-swagger component with its upstream equivalent
  - Document any structural changes, new props, or removed functionality

---

## Component Migrations

### Auth Components

- [x] `src/internal/auth/api-key-auth.tsx` - Migrate `QTextInput`
- [x] `src/internal/auth/basic-auth.tsx` - Migrate `QTextInput`
- [x] `src/internal/auth/oauth2.tsx` - Migrate `QButton`, `QCheckbox`, `QCombobox`, `QTextInput`
- [x] `src/internal/auth/authorization-popup.tsx` - Migrate `QDialog`, `QDialogBody`, `QDialogHeader`
- [x] `src/internal/auth/authorize-btn.tsx` - Migrate `QButton`
- [x] `src/internal/auth/authorize-operation-btn.tsx` - Migrate `QIconButton`
- [x] `src/internal/auth/auths.tsx` - Migrate `QButton`

### Core Internal Components

- [x] `src/internal/clear.tsx` - Migrate `QButton`
- [x] `src/internal/content-type.tsx` - Migrate `QCombobox`
- [x] `src/internal/execute.tsx` - Migrate `QButton`
- [x] `src/internal/layout.tsx` - Migrate `clsx` from `@qui/base`
- [x] `src/internal/model-collapse.tsx` - Migrate `QButton`, `QIcon`
- [x] `src/internal/model-example.tsx` - Migrate `QTab`, `QTabList`, `QTabPanel`, `QTabPanels`, `QTabs`
- [x] `src/internal/models.tsx` - Migrate `clsx`, `QCollapse`, `QIcon`
- [x] `src/internal/object-model.tsx` - Migrate `QButton`
- [x] `src/internal/operation.tsx` - Migrate `QCollapse`, `QInlineAlert`, `QProgressBar`
- [x] `src/internal/operation-summary.tsx` - Migrate `clsx`, `QIcon`, `QIconButton`
- [x] `src/internal/operation-summary-method.tsx` - Migrate `clsx`, `QButton`, `QButtonProps`
- [x] `src/internal/operation-tag.tsx` - Migrate `clsx`, `QCollapse`, `QIcon`, `QLink`
- [x] `src/internal/param-body.tsx` - Migrate `QButton`
- [x] `src/internal/schemes.tsx` - Migrate `QCombobox`
- [x] `src/internal/servers.tsx` - Migrate `QCombobox`, `QTextInput`
- [x] `src/internal/try-it-out-button.tsx` - Migrate `QButton`
- [x] `src/internal/use-theme-context.tsx` - Migrate `QuiTheme` from `@qui/base`

### JSON Schema Components

- [x] `src/internal/json-schema-array.tsx` - Migrate `QButton`, `QCombobox`, `QIconButton`
- [x] `src/internal/json-schema-array-item-text.tsx` - Migrate `QTextInput`
- [x] `src/internal/json-schema-string.tsx` - Migrate `QCombobox`, `QTextInput`

### JSON Model Viewer Components

- [x] `src/internal/json-model-viewer/json-model-viewer.tsx` - Migrate `clsx`
- [x] `src/internal/json-model-viewer/components/data-key-pair.tsx` - Migrate `clsx`, `QIcon`
- [x] `src/internal/json-model-viewer/components/data-types/object.tsx` - Migrate `QIcon`
- [x] `src/internal/json-model-viewer/components/internal/ref-name.tsx` - Migrate `clsx`, `QIconButton`

### CodeMirror Components

- [x] `src/code-mirror/docs-code-mirror.tsx` - Migrate `QuiTheme`, `QIconButton`, `QTooltip`, `QTooltipTrigger`, `QTooltipContent`
- [x] `src/code-mirror/copy-to-clipboard.tsx` - Migrate `QIconButton`

---

## CSS Variable Migration

Update CSS files to use modern qds-core CSS variables.

### CSS Files

- [x] `src/internal/json-model-viewer/json-model-viewer.css`
  - `--q-background-3` → `--color-background-neutral-03`
  - `--q-background-2` → `--color-background-neutral-02`
  - `--q-font-mono` + `--q-font-size-body-s` → `--font-static-code-sm-default`
  - `--q-font-metadata-md` → `--font-static-body-xs-default`
  - `--q-font-body-sm-strong` → `--font-static-code-sm-bold`
- [x] `src/internal/operation-summary-method.css`
  - `--q-teal-500/600` → `--color-category-teal-medium/strong`
  - `--q-purple-500/600` → `--color-category-purple-medium/strong`
  - `--q-kiwi-500/600` → `--color-category-kiwi-medium/strong`
  - `--q-orange-400/500` → `--color-category-orange-medium/strong`
  - Added `--color-category-green-medium/strong` for GET method
  - Added `--color-category-yellow-medium/strong` for PUT method
- [x] `src/code-mirror/docs-code-mirror.css`
  - `--q-font-mono` → `--font-static-code-sm-default`
  - `--q-background-2` → `--color-background-neutral-02`
- [x] `src/internal/input.css` - No legacy variables found
- [x] `src/internal/auth/authorization-popup.css` - No legacy variables found
- [x] `src/internal/auth/auth.css` - No legacy variables found

### Variable Mapping Reference

| Legacy Variable | Modern Variable (qds-core) |
|-----------------|---------------------------|
| `--q-background-2` | `--color-background-neutral-02` |
| `--q-background-3` | `--color-background-neutral-03` |
| `--q-font-mono` | `--font-static-code-sm-default` (font shorthand) |
| `--q-font-size-body-s` | `--font-static-body-sm-default` (font shorthand) |
| `--q-font-metadata-md` | `--font-static-body-xs-default` |
| `--q-font-body-sm-strong` | `--font-static-code-sm-bold` |
| `--q-teal-500/600` | `--color-category-teal-medium/strong` |
| `--q-purple-500/600` | `--color-category-purple-medium/strong` |
| `--q-kiwi-500/600` | `--color-category-kiwi-medium/strong` |
| `--q-orange-400/500` | `--color-category-orange-medium/strong` |

### Reference Locations

- **Legacy CSS variables:** `/home/rbower/code/qui-main/packages/styles`
- **Legacy components:** `/home/rbower/code/qui-main/packages/react`
- **Modern color docs:** `packages/docs/react-docs/temp/qui-ai/theming-colors.md`
- **Modern typography docs:** `packages/docs/react-docs/temp/qui-ai/theming-typography.md`

---

## Post-Migration

- [x] Update package.json dependencies (package.json already uses modern `@qualcomm-ui/*` deps)
- [x] Verify no `@qui/react` or `@qui/base` imports remain in source files
- [ ] Run tests to verify migration
- [ ] Build package - Note: Build has TypeScript errors unrelated to QUI migration:
  - Pre-existing `import type` issues (verbatimModuleSyntax)
  - Missing module type declarations (immutable, zustand, @uiw/codemirror-*, @qui/swagger-ui-react)
  - TypeScript strict mode issues with `data-*` attributes in typed props

---

## Component Mapping Reference

| Legacy (`@qui/react`)       | Modern (`@qualcomm-ui/react`)                      | Docs                              |
| --------------------------- | -------------------------------------------------- | --------------------------------- |
| `QButton`                   | `Button` from `@qualcomm-ui/react/button`          | `components-button.md`            |
| `QIconButton`               | `IconButton` from `@qualcomm-ui/react/icon-button` | `components-icon-button.md`       |
| `QCheckbox`                 | `Checkbox` from `@qualcomm-ui/react/checkbox`      | `components-checkbox.md`          |
| `QCollapse`                 | `Collapsible` from `@qualcomm-ui/react/collapsible`| `components-collapsible.md`       |
| `QCombobox`                 | `Combobox` from `@qualcomm-ui/react/combobox`      | `components-combobox.md`          |
| `QDialog`                   | `Dialog` from `@qualcomm-ui/react/dialog`          | `components-dialog.md`            |
| `QIcon`                     | `Icon` from `@qualcomm-ui/react/icon`              | `components-icon.md`              |
| `QInlineAlert`              | `InlineNotification` from `@qualcomm-ui/react/inline-notification` | `components-inline-notification.md` |
| `QLink`                     | `Link` from `@qualcomm-ui/react/link`              | `components-link.md`              |
| `QProgressBar`              | `Progress` from `@qualcomm-ui/react/progress`      | `components-progress.md`          |
| `QTab/QTabs`                | `Tabs` from `@qualcomm-ui/react/tabs`              | `components-tabs.md`              |
| `QTextInput`                | `TextInput` from `@qualcomm-ui/react/text-input`   | `components-text-input.md`        |
| `QTooltip`                  | `Tooltip` from `@qualcomm-ui/react/tooltip`        | `components-tooltip.md`           |
| `clsx` (`@qui/base`)        | `clsx` from `@qualcomm-ui/utils/clsx`              | N/A                              |
| `QuiTheme` (`@qui/base`)    | `QdsTheme` from `@qualcomm-ui/qds-core/theme`      | `theming-overview.md`             |

**Docs location:** `packages/docs/react-docs/temp/qui-ai/`

**API Preference:** Use the **simple API** (e.g., `<Button>`, `<Select>`) over the composite API (`Component.Root`, etc.) unless granular control is needed.
