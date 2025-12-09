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

- [ ] `src/internal/auth/api-key-auth.tsx` - Migrate `QTextInput`
- [ ] `src/internal/auth/basic-auth.tsx` - Migrate `QTextInput`
- [ ] `src/internal/auth/oauth2.tsx` - Migrate `QButton`, `QCheckbox`, `QCombobox`, `QTextInput`
- [ ] `src/internal/auth/authorization-popup.tsx` - Migrate `QButton`, `QDialog`, `QDialogBody`, `QDialogFooter`, `QDialogHeader`
- [ ] `src/internal/auth/authorize-btn.tsx` - Migrate `QButton`
- [ ] `src/internal/auth/authorize-operation-btn.tsx` - Migrate `QIconButton`
- [ ] `src/internal/auth/auths.tsx` - Migrate `QButton`

### Core Internal Components

- [ ] `src/internal/clear.tsx` - Migrate `QButton`
- [ ] `src/internal/content-type.tsx` - Migrate `QCombobox`
- [ ] `src/internal/execute.tsx` - Migrate `QButton`
- [ ] `src/internal/layout.tsx` - Migrate `clsx` from `@qui/base`
- [ ] `src/internal/model-collapse.tsx` - Migrate `QButton`, `QIcon`
- [ ] `src/internal/model-example.tsx` - Migrate `QTab`, `QTabList`, `QTabPanel`, `QTabPanels`, `QTabs`
- [ ] `src/internal/models.tsx` - Migrate `clsx`, `QCollapse`, `QIcon`
- [ ] `src/internal/object-model.tsx` - Migrate `QButton`
- [ ] `src/internal/operation.tsx` - Migrate `QCollapse`, `QInlineAlert`, `QProgressBar`
- [ ] `src/internal/operation-summary.tsx` - Migrate `clsx`, `QIcon`, `QIconButton`
- [ ] `src/internal/operation-summary-method.tsx` - Migrate `clsx`, `QButton`, `QButtonProps`
- [ ] `src/internal/operation-tag.tsx` - Migrate `clsx`, `QCollapse`, `QIcon`, `QLink`
- [ ] `src/internal/param-body.tsx` - Migrate `QButton`
- [ ] `src/internal/schemes.tsx` - Migrate `QCombobox`
- [ ] `src/internal/servers.tsx` - Migrate `QCombobox`, `QTextInput`
- [ ] `src/internal/try-it-out-button.tsx` - Migrate `QButton`
- [ ] `src/internal/use-theme-context.tsx` - Migrate `QuiTheme` from `@qui/base`

### JSON Schema Components

- [ ] `src/internal/json-schema-array.tsx` - Migrate `QButton`, `QCombobox`, `QIconButton`
- [ ] `src/internal/json-schema-array-item-text.tsx` - Migrate `QTextInput`
- [ ] `src/internal/json-schema-string.tsx` - Migrate `QCombobox`, `QTextInput`

### JSON Model Viewer Components

- [ ] `src/internal/json-model-viewer/json-model-viewer.tsx` - Migrate `clsx`
- [ ] `src/internal/json-model-viewer/components/data-key-pair.tsx` - Migrate `clsx`, `QIcon`
- [ ] `src/internal/json-model-viewer/components/data-types/object.tsx` - Migrate `QIcon`
- [ ] `src/internal/json-model-viewer/components/internal/ref-name.tsx` - Migrate `clsx`, `QIconButton`

### CodeMirror Components

- [ ] `src/code-mirror/docs-code-mirror.tsx` - Migrate `QuiTheme`, `QIconButton`, `QTooltip`, `QTooltipTrigger`, `QTooltipContent`
- [ ] `src/code-mirror/copy-to-clipboard.tsx` - Migrate `QIconButton`, `QTooltip`, `QTooltipTrigger`, `QTooltipContent`

---

## CSS Variable Migration

Update CSS files to use modern qds-core CSS variables.

### CSS Files

- [ ] `src/internal/json-model-viewer/json-model-viewer.css`
  - `--q-background-3`, `--q-background-2`
  - `--q-font-mono`, `--q-font-size-body-s`
  - `--q-font-metadata-md`, `--q-font-body-sm-strong`
  - `--q-font-stretch-body`
- [ ] `src/internal/operation-summary-method.css`
  - `--q-teal-500`, `--q-teal-600`
  - `--q-purple-500`, `--q-purple-600`
  - `--q-kiwi-500`, `--q-kiwi-600`
  - `--q-orange-400`, `--q-orange-500`
- [ ] `src/code-mirror/docs-code-mirror.css`
  - `--q-font-mono`
  - `--q-background-2`
- [ ] `src/internal/input.css` - Review for variable usage
- [ ] `src/internal/auth/authorization-popup.css` - Review for variable usage
- [ ] `src/internal/auth/auth.css` - Review for variable usage

### Variable Mapping Reference

| Legacy Variable | Modern Variable (qds-core) |
|-----------------|---------------------------|
| `--q-background-2` | TBD |
| `--q-background-3` | TBD |
| `--q-font-mono` | TBD |
| `--q-font-size-body-s` | TBD |
| `--q-teal-500/600` | TBD |
| `--q-purple-500/600` | TBD |
| `--q-kiwi-500/600` | TBD |
| `--q-orange-400/500` | TBD |

---

## Post-Migration

- [ ] Update package.json dependencies (remove `@qui/react`, `@qui/base` if no longer needed)
- [ ] Run tests to verify migration
- [ ] Build package to verify no compilation errors

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
| `clsx` (`@qui/base`)        | `clsx` from `clsx` package (or `@qualcomm-ui/utils`)| N/A                              |
| `QuiTheme` (`@qui/base`)    | See theming docs                                   | `theming-overview.md`             |

**Docs location:** `packages/docs/react-docs/temp/qui-ai/`
