# @qualcomm-ui/eslint-plugin-react

ESLint plugin for enforcing accessibility best practices with QUI React components.

## Installation

```bash
pnpm add -D @qualcomm-ui/eslint-plugin-react
```

## Usage

### Flat Config (eslint.config.js)

```js
import {config} from "@qualcomm-ui/eslint-plugin-react"

export default [
  ...config,
]
```

Or configure rules individually:

```js
import {plugin} from "@qualcomm-ui/eslint-plugin-react"

export default [
  {
    plugins: {"@qualcomm-ui/react": plugin},
    rules: {
      "@qualcomm-ui/react/accessible-name": "error",
      "@qualcomm-ui/react/icon-decorative": "error",
      "@qualcomm-ui/react/input-label-association": "error",
    }
  }
]
```

## Rules

### accessible-name

Requires `aria-label` or `aria-labelledby` on components that lack visible text:

- `IconButton`
- `InlineIconButton`
- `HeaderBarActionIconButton`
- `Avatar`

```jsx
// Bad
<IconButton icon={Close} />

// Good
<IconButton icon={Close} aria-label="Close dialog" />
```

### icon-decorative

Requires `Icon` components to be marked as decorative or have an accessible label:

```jsx
// Bad
<Icon icon={Search} />

// Good - decorative
<Icon icon={Search} aria-hidden="true" />

// Good - meaningful
<Icon icon={Warning} aria-label="Warning" />
```

### input-label-association

Requires form inputs to have proper label association:

```jsx
// Bad
<TextInput />

// Good - aria-label
<TextInput aria-label="Email address" />

// Good - compound with Label
<TextInput.Root>
  <TextInput.Label>Email</TextInput.Label>
  <TextInput.Input />
</TextInput.Root>
```

Applies to: `TextInput`, `NumberInput`, `PasswordInput`, `Select`, `Combobox`, `Slider`, `Switch`, `Checkbox`, `Radio`

## Development

```bash
pnpm build        # Compile TypeScript
pnpm build:watch  # Watch mode
pnpm test         # Run tests
```
