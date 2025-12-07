import {RuleTester} from "@typescript-eslint/rule-tester"
import tseslint from "typescript-eslint"
import {afterAll, describe, it} from "vitest"

import {accessibleName} from "../src/rules/accessible-name"

RuleTester.afterAll = afterAll
RuleTester.it = it
RuleTester.itOnly = it.only
RuleTester.describe = describe

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      ecmaFeatures: {jsx: true},
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
})

describe("accessible-name", () => {
  describe("IconButton", () => {
    ruleTester.run("IconButton", accessibleName, {
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
      ],
    })
  })

  describe("InlineIconButton", () => {
    ruleTester.run("InlineIconButton", accessibleName, {
      invalid: [
        {
          code: `
            import {InlineIconButton} from "@qualcomm-ui/react"
            const App = () => <InlineIconButton icon={Search} />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import * as QUI from "@qualcomm-ui/react"
            const App = () => <QUI.InlineIconButton icon={Search} />
          `,
          errors: [{messageId: "missingLabel"}],
        },
      ],
      valid: [
        {
          code: `
            import {InlineIconButton} from "@qualcomm-ui/react"
            const App = () => <InlineIconButton icon={Search} aria-label="Search" />
          `,
        },
        {
          code: `
            import {InlineIconButton} from "@qualcomm-ui/react"
            const App = () => <InlineIconButton icon={Close} aria-labelledby="close-label" />
          `,
        },
      ],
    })
  })

  describe("HeaderBarActionIconButton", () => {
    ruleTester.run("HeaderBarActionIconButton", accessibleName, {
      invalid: [
        {
          code: `
            import {HeaderBarActionIconButton} from "@qualcomm-ui/react"
            const App = () => <HeaderBarActionIconButton icon={Menu} />
          `,
          errors: [{messageId: "missingLabel"}],
        },
      ],
      valid: [
        {
          code: `
            import {HeaderBarActionIconButton} from "@qualcomm-ui/react"
            const App = () => <HeaderBarActionIconButton icon={Menu} aria-label="Open menu" />
          `,
        },
      ],
    })
  })

  describe("Avatar", () => {
    ruleTester.run("Avatar", accessibleName, {
      invalid: [
        {
          code: `
            import {Avatar} from "@qualcomm-ui/react"
            const App = () => <Avatar src="/user.jpg" />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {Avatar as UserAvatar} from "@qualcomm-ui/react"
            const App = () => <UserAvatar src="/user.jpg" />
          `,
          errors: [{messageId: "missingLabel"}],
        },
      ],
      valid: [
        {
          code: `
            import {Avatar} from "@qualcomm-ui/react"
            const App = () => <Avatar src="/user.jpg" aria-label="John Doe" />
          `,
        },
        {
          code: `
            import {Avatar} from "@qualcomm-ui/react"
            const App = () => <Avatar src="/user.jpg" aria-labelledby="user-name" />
          `,
        },
        {
          code: `
            import {Avatar} from "other-library"
            const App = () => <Avatar src="/user.jpg" />
          `,
        },
      ],
    })
  })

  describe("non-QUI components", () => {
    ruleTester.run("non-QUI", accessibleName, {
      invalid: [],
      valid: [
        {code: `<IconButton />`},
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
  })
})
