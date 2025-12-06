import {RuleTester} from "@typescript-eslint/rule-tester"
import tseslint from "typescript-eslint"
import {afterAll, describe, it} from "vitest"

// @ts-expect-error
import {accessibleName} from "../rules/accessible-name.js"

RuleTester.afterAll = afterAll
RuleTester.it = it
RuleTester.itOnly = it.only
RuleTester.describe = describe

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
})

ruleTester.run("accessible-name", accessibleName, {
  invalid: [
    {
      code: `
        import {IconButton} from "@qualcomm-ui/react"
        const App = () => <IconButton />
      `,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `
        import {IconButton} from "@qualcomm-ui/react"
        const App = () => <IconButton icon={<Icon />} />
      `,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `
        import {IconButton} from "@qualcomm-ui/react"
        const App = () => <IconButton aria-label="" />
      `,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `
        import {IconButton} from "@qualcomm-ui/react"
        const App = () => <IconButton aria-labelledby="" />
      `,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `
        import {IconButton} from "@qualcomm-ui/react"
        const App = () => <IconButton aria-label={""} />
      `,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `
        import {IconButton as IB} from "@qualcomm-ui/react"
        const App = () => <IB />
      `,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `
        import * as QUI from "@qualcomm-ui/react"
        const App = () => <QUI.IconButton />
      `,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `
        import {IconButton} from "@qualcomm-ui/react-internal"
        const App = () => <IconButton />
      `,
      errors: [{messageId: "missingLabel"}],
    },
  ],
  valid: [
    {
      code: `
        import {IconButton} from "@qualcomm-ui/react"
        const App = () => <IconButton aria-label="Close" />
      `,
    },
    {
      code: `
        import {IconButton} from "@qualcomm-ui/react"
        const App = () => <IconButton aria-labelledby="close-label" />
      `,
    },
    {
      code: `
        import {IconButton} from "@qualcomm-ui/react"
        const App = () => <IconButton aria-label="Delete" icon={<DeleteIcon />} />
      `,
    },
    {
      code: `
        import {IconButton} from "@qualcomm-ui/react"
        const App = () => <IconButton aria-label={label} />
      `,
    },
    {
      code: `
        import {IconButton as IB} from "@qualcomm-ui/react"
        const App = () => <IB aria-label="Edit" />
      `,
    },
    {
      code: `
        import * as QUI from "@qualcomm-ui/react"
        const App = () => <QUI.IconButton aria-label="Search" />
      `,
    },
    {
      code: `<IconButton />`,
    },
    {
      code: `
        import {IconButton} from "other-library"
        const App = () => <IconButton />
      `,
    },
    {
      code: `
        const IconButton = () => <button />
        const App = () => <IconButton />
      `,
    },
    {
      code: `
        import {Button} from "@qualcomm-ui/react"
        const App = () => <Button>Click me</Button>
      `,
    },
  ],
})
