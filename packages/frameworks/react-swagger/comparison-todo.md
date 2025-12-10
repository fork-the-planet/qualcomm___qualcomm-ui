# React-Swagger vs Upstream Swagger-UI Component Comparison

## Overview

Comparing react-swagger components with their upstream equivalents in `/home/rbower/code/swagger-ui/src`.

---

## Auth Components

| Component | Upstream Location | Status | Notes |
|-----------|------------------|--------|-------|
| api-key-auth | `core/components/auth/api-key-auth.jsx` | [x] Compared | Missing `authSelectors` prop usage |
| basic-auth | `core/components/auth/basic-auth.jsx` | [x] Compared | JumpToPath uses different path |
| oauth2 | `core/components/auth/oauth2.jsx` | [x] Compared | Class vs functional, QUI components |
| authorization-popup | `core/components/auth/authorization-popup.jsx` | [x] Compared | ✅ Logic matches, uses QUI Dialog |
| authorize-btn | `core/components/auth/authorize-btn.jsx` | [x] Compared | ✅ Logic matches, uses QUI Button + lucide icons |
| authorize-operation-btn | `core/components/auth/authorize-operation-btn.jsx` | [x] Compared | ✅ Logic matches, uses QUI IconButton + lucide icons |
| auths | `core/components/auth/auths.jsx` | [x] Compared | Missing `authSelectors` in AuthItem props |

### Auth Component Detailed Notes

**api-key-auth.tsx:**
- ⚠️ Missing `authSelectors` prop - upstream uses `authSelectors.selectAuthPath(name)` for JumpToPath
- Uses hardcoded path `["securityDefinitions", name]` instead

**basic-auth.tsx:**
- ⚠️ Same JumpToPath issue as api-key-auth
- Uses hardcoded path instead of `authSelectors.selectAuthPath(name)`

**auths.tsx:**
- ⚠️ Missing `authSelectors` prop being passed to AuthItem component
- Upstream passes: `authSelectors={authSelectors}` to AuthItem
- Button styling uses QUI props instead of className

**authorization-popup.tsx:**
- ✅ Logic matches - both call `authActions.showDefinitions(false)` on close
- ✅ Both pass same props to Auths component
- Uses QUI Dialog instead of custom modal markup (dialog-ux, backdrop-ux, modal-ux classes)

**authorize-btn.tsx:**
- ✅ Logic matches - both conditionally render AuthorizationPopup based on showPopup
- Uses QUI Button + lucide icons (LockIcon, LockOpenIcon) instead of getComponent icons
- Missing conditional className for locked/unlocked state (upstream has `btn authorize locked/unlocked`)

**authorize-operation-btn.tsx:**
- ✅ Logic matches - both stopPropagation on click
- Uses QUI IconButton + lucide icons instead of native button + getComponent icons

---

## Core Internal Components

| Component | Upstream Location | Status | Notes |
|-----------|------------------|--------|-------|
| clear | `core/components/clear.jsx` | [x] Compared | ✅ Logic matches, uses QUI Button |
| content-type | `core/components/content-type.jsx` | [x] Compared | ✅ Uses QUI Select, missing `label` prop |
| execute | `core/components/execute.jsx` | [x] Compared | ✅ Logic matches, uses QUI Button + icon |
| operation | `core/components/operation.jsx` | [x] Compared | Hybrid Collapse/Collapsible, uses Progress + InlineNotification |
| operation-summary | `core/components/operation-summary.jsx` | [x] Compared | Different structure, missing getConfigs, CopyToClipboardBtn |
| operation-summary-method | `core/components/operation-summary-method.jsx` | [x] Compared | ✅ Intentional design - QUI Button with method colors |
| operation-tag | `core/components/operation-tag.jsx` | [x] Compared | ✅ Logic matches, uses QUI Collapsible + Link |
| param-body | `core/components/param-body.jsx` | [x] Compared | Uses DocsCodeMirror instead of TextArea/HighlightCode |
| try-it-out-button | `core/components/try-it-out-button.jsx` | [x] Compared | ✅ Logic matches, uses QUI Button + icons |

### Core Component Detailed Notes

**operation.tsx:**
- Uses hybrid approach: `<Collapse>` initially, then switches to `<Collapsible.Root>` after 50ms load delay
- Uses `<Progress>` instead of `<RollingLoadSVG>` for loading animation
- Uses `<InlineNotification>` instead of plain div for validation errors
- ⚠️ Missing `getConfigs` prop in OperationSummary call (upstream passes it)

**operation-summary.tsx:**
- Uses ChevronUpIcon from lucide instead of ArrowUpIcon/ArrowDownIcon via getComponent
- Adds custom Link2 IconButton inside summary control for deep linking
- Uses custom `useJumpToHash` hook for scroll behavior
- ⚠️ Missing `getConfigs` prop (upstream passes it)
- ⚠️ Missing `CopyToClipboardBtn` component
- ⚠️ Missing `path` variable destructuring (used in aria-label in upstream)
- ⚠️ Different structure - Link2 button is inside summary control

**operation-summary-method.tsx:**
- ✅ Intentional design difference for QUI styling
- Upstream uses simple span with className="opblock-summary-method"
- react-swagger uses Button with emphasis/variant props and propsMap for method colors

**operation-tag.tsx:**
- ✅ Logic matches
- Uses ChevronUpIcon from lucide instead of ArrowUpIcon/ArrowDownIcon
- Uses Collapsible.Root instead of Collapse
- Uses QUI Link with ExternalLinkIcon instead of native Link via getComponent

**param-body.tsx:**
- ⚠️ Different code display approach - uses DocsCodeMirror instead of TextArea/HighlightCode
- Uses lucide icons (Edit2Icon, XIcon) for Edit/Cancel buttons
- Functional component with hooks instead of class with lifecycle methods
- ⚠️ Missing `className` prop on ContentType
- ⚠️ Uses `label` instead of `ariaLabel` prop on ContentType

---

## JSON Schema 5 Plugin Components

| Component | Upstream Location | Status | Notes |
|-----------|------------------|--------|-------|
| model-collapse | `core/plugins/json-schema-5/components/model-collapse.jsx` | [x] Compared | Simplified scroll behavior, uses QUI Button |
| model-example | `core/plugins/json-schema-5/components/model-example.jsx` | [x] Compared | Uses native tabs, react-swagger uses Tabs component |
| models | `core/plugins/json-schema-5/components/models.jsx` | [x] Compared | Similar structure, uses Collapsible |
| object-model | `core/plugins/json-schema-5/components/object-model.jsx` | [x] Compared | ⚠️ MAJOR DIFFERENCE - uses JsonModelViewer |
| schemes | `core/plugins/json-schema-5/components/schemes.jsx` | [x] Compared | ✅ Uses QUI Select, lifecycle converted to hooks |
| json-schema-components | `core/plugins/json-schema-5/components/json-schema-components.jsx` | [x] Compared | Upstream uses DebounceInput, react-swagger uses TextInput |

### JSON Schema Component Detailed Notes

**model-collapse.tsx:**
- Functional component with hooks instead of class with lifecycle methods
- Uses QUI Button with ChevronUpIcon instead of native button with model-toggle CSS class
- ⚠️ Different scroll/navigation behavior:
  - Upstream uses `layoutSelectors.getScrollToKey()` and `layoutActions.readyToScroll()`
  - react-swagger uses simple `getElementById/scrollIntoView` based on URL hash
- ⚠️ Missing `layoutSelectors`/`layoutActions` usage
- ⚠️ Missing `onLoad` ref behavior for scroll coordination

**object-model.tsx:**
- ⚠️ **MAJOR STRUCTURAL DIFFERENCE**
- Upstream uses complex table-based property rendering with recursive Model component
- react-swagger uses `JsonModelViewer` - a custom JSON tree viewer component
- ⚠️ Missing all table-based property rendering logic
- ⚠️ Missing Property, ModelExtensions component usage
- ⚠️ Missing allOf/anyOf/oneOf/not handling from upstream

---

## OAS3 Plugin Components

| Component | Upstream Location | Status | Notes |
|-----------|------------------|--------|-------|
| servers | `core/plugins/oas3/components/servers.jsx` | [x] Compared | Uses native select/input, react-swagger uses Select/TextInput |

---

## Key Differences Summary

### Intentional Design Differences

The react-swagger package intentionally replaces native HTML elements with QUI-styled components:

| Native Element | QUI Replacement |
|---------------|-----------------|
| `<select>` | `Select` from `@qualcomm-ui/react/select` |
| `<input type="text">` | `TextInput` from `@qualcomm-ui/react/text-input` |
| `<input type="checkbox">` | `Checkbox` from `@qualcomm-ui/react/checkbox` |
| `<button>` | `Button` from `@qualcomm-ui/react/button` |
| Native tabs (`<ul>/<li>/<button>`) | `Tabs` from `@qualcomm-ui/react/tabs` |
| Swagger-UI `<Collapse>` | `Collapsible` from `@qualcomm-ui/react/collapsible` |
| `<a>` (links) | `Link` from `@qualcomm-ui/react/link` |
| SVG icons | `Icon` from `@qualcomm-ui/react/icon` with lucide-react |
| Custom modals | `Dialog` from `@qualcomm-ui/react/dialog` |
| Loading spinners | `Progress` from `@qualcomm-ui/react/progress` |
| Error messages | `InlineNotification` from `@qualcomm-ui/react/inline-notification` |
| Code display (TextArea/HighlightCode) | `DocsCodeMirror` custom component |

### Structural Differences to Review

1. **oauth2.jsx**: Upstream uses class component with native inputs; react-swagger uses functional component with QUI inputs
2. **servers.jsx**: Upstream uses `e.target.value` and `data-variable` attributes; react-swagger uses controlled Select/TextInput
3. **model-example.jsx**: Upstream uses native tab buttons with `data-name`; react-swagger uses Tabs component with value-based control
4. **models.jsx**: Upstream uses `ArrowUpIcon/ArrowDownIcon`; react-swagger uses `ChevronUpIcon` from lucide-react
5. **operation-tag.jsx**: Same icon difference as models.jsx
6. **object-model.jsx**: **MAJOR** - Upstream uses table-based rendering; react-swagger uses JsonModelViewer

---

## Functional Differences to Address

### High Priority (May affect functionality)

- [ ] **object-model.tsx**: Review if JsonModelViewer approach is sufficient or if table-based rendering is needed for allOf/anyOf/oneOf/not schemas
- [ ] **model-collapse.tsx**: Review if simplified scroll behavior is sufficient or if layoutSelectors/layoutActions are needed
- [ ] **operation-summary.tsx**: Add missing `getConfigs` prop, consider adding `CopyToClipboardBtn`
- [ ] **operation.tsx**: Add missing `getConfigs` prop to OperationSummary

### Medium Priority (Missing props)

- [ ] **api-key-auth.tsx**: Add `authSelectors` prop for dynamic JumpToPath path
- [ ] **basic-auth.tsx**: Add `authSelectors` prop for dynamic JumpToPath path
- [ ] **auths.tsx**: Pass `authSelectors` prop to AuthItem component
- [ ] **param-body.tsx**: Add `className` prop to ContentType, verify `label` vs `ariaLabel`

### Low Priority (Cosmetic/Minor)

- [ ] **authorize-btn.tsx**: Consider adding conditional className for locked/unlocked visual state
- [ ] **operation-summary.tsx**: Add `path` variable for aria-label accessibility

---

## External Dependencies Analysis

### Current Dependencies (package.json)

**Dependencies (bundled):**
| Package | Version | Status |
|---------|---------|--------|
| `@braintree/sanitize-url` | ^7.1.1 | ✅ Used in utils.ts |
| `css.escape` | ^1.5.1 | ✅ Used in utils.ts |
| `immutable` | ^3.8.2 | ✅ Used throughout |
| `randombytes` | ^2.1.0 | ✅ Used in model-example.tsx |

**Peer Dependencies:**
| Package | Version | Status |
|---------|---------|--------|
| `@tanstack/react-virtual` | >=3.13.9 | ✅ Used in json-model-viewer |
| `@qualcomm-ui/core` | workspace:^1.0.11 | ✅ Used for selectCollection |
| `@qualcomm-ui/qds-core` | workspace:^1.9.3 | ✅ Used for QdsTheme type |
| `@qualcomm-ui/react-core` | workspace:^1.0.11 | ✅ Indirect dependency |
| `@qualcomm-ui/utils` | workspace:^1.0.4 | ✅ Used for clsx |
| `lucide-react` | >=0.379.0 <1 | ✅ Used throughout for icons |
| `react` | >=19.0.0 | ✅ Core dependency |
| `react-dom` | >=19.0.0 | ✅ Core dependency |
| `swagger-ui-react` | >=5.30.0 | ✅ Used in swagger.tsx |

### ⚠️ Missing Dependencies (imported but not declared)

| Package | Used In | Suggested Type |
|---------|---------|----------------|
| `lodash-es` | operation-summary.tsx | peerDependency or dependency |
| `zustand` | json-model-viewer/stores/*.ts | peerDependency or dependency |
| `@uiw/codemirror-extensions-langs` | docs-code-mirror.tsx | peerDependency or dependency |
| `@uiw/codemirror-theme-github` | docs-code-mirror.tsx | peerDependency or dependency |
| `@uiw/react-codemirror` | docs-code-mirror.tsx | peerDependency or dependency |

### Dependency Configuration Issues

| Issue | Details | Priority |
|-------|---------|----------|
| `@qualcomm-ui/react` in devDependencies | Should be peerDependency since it's directly imported | High |
| CodeMirror packages missing | DocsCodeMirror requires @uiw/* packages | High |
| `zustand` missing | JsonModelViewer stores require zustand | High |
| `lodash-es` missing | toString function used in operation-summary.tsx | Medium |

### All External Imports by Category

**React Ecosystem:**
- `react` - hooks, types, components
- `react-dom` - DOM utilities

**QUI Components (@qualcomm-ui/react/*):**
- `@qualcomm-ui/react/button` - Button, IconButton, ButtonProps
- `@qualcomm-ui/react/checkbox` - Checkbox
- `@qualcomm-ui/react/collapsible` - Collapsible
- `@qualcomm-ui/react/dialog` - Dialog
- `@qualcomm-ui/react/icon` - Icon
- `@qualcomm-ui/react/inline-notification` - InlineNotification
- `@qualcomm-ui/react/link` - Link
- `@qualcomm-ui/react/progress` - Progress
- `@qualcomm-ui/react/select` - Select
- `@qualcomm-ui/react/tabs` - Tab, Tabs
- `@qualcomm-ui/react/text-input` - TextInput
- `@qualcomm-ui/react/tooltip` - Tooltip

**QUI Core:**
- `@qualcomm-ui/core/select` - selectCollection helper
- `@qualcomm-ui/qds-core/theme` - QdsTheme type
- `@qualcomm-ui/utils/clsx` - className utility

**Icons (lucide-react):**
- ChevronUpIcon, Link2, ExternalLinkIcon, Edit2Icon, XIcon
- PlayIcon, Trash2Icon, MinusIcon, PlusIcon
- FlaskConicalIcon, RotateCcw, LockIcon, LockOpenIcon
- DownloadIcon, CheckIcon, CopyIcon

**Data/State:**
- `immutable` - List, Map, OrderedMap, fromJS
- `zustand` - create, StoreApi, useStore, createStore ⚠️ Missing

**Utilities:**
- `lodash-es` - toString ⚠️ Missing
- `@braintree/sanitize-url` - sanitizeUrl
- `css.escape` - cssEscape
- `randombytes` - random byte generation

**CodeMirror (DocsCodeMirror):**
- `@uiw/react-codemirror` - CodeMirror, ReactCodeMirrorProps ⚠️ Missing
- `@uiw/codemirror-extensions-langs` - langs ⚠️ Missing
- `@uiw/codemirror-theme-github` - githubDark, githubLight ⚠️ Missing

**Swagger:**
- `swagger-ui-react` - SwaggerUI

**Virtual Scrolling:**
- `@tanstack/react-virtual` - virtual list utilities

---

## Action Items - Dependencies

### High Priority (Build will fail)

- [ ] Add `@uiw/react-codemirror` to dependencies or peerDependencies
- [ ] Add `@uiw/codemirror-extensions-langs` to dependencies or peerDependencies
- [ ] Add `@uiw/codemirror-theme-github` to dependencies or peerDependencies
- [ ] Add `zustand` to dependencies or peerDependencies
- [ ] Move `@qualcomm-ui/react` from devDependencies to peerDependencies

### Medium Priority

- [ ] Add `lodash-es` to dependencies or peerDependencies
- [ ] Consider if `immutable` version ^3.8.2 is appropriate (current swagger-ui uses ^4.x)

### Low Priority (Review)

- [ ] Review if all @qualcomm-ui/* imports have corresponding peer dependencies
- [ ] Consider bundling vs peer dependency strategy for CodeMirror packages

---

## Comparison Complete

All components have been compared. The main findings are:

1. **Auth components** have minor prop differences (missing authSelectors for JumpToPath)
2. **Core components** are functionally equivalent with QUI replacements
3. **object-model.tsx** has a major structural difference using JsonModelViewer instead of table-based rendering
4. **model-collapse.tsx** has simplified scroll behavior that may need review
5. **operation-summary.tsx** is missing some upstream features (CopyToClipboardBtn, getConfigs prop)
6. **Missing dependencies** - Several packages are imported but not declared in package.json
