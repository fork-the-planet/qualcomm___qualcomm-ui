import {RuleTester} from "@typescript-eslint/rule-tester"
import tseslint from "typescript-eslint"
import {afterAll, describe, it} from "vitest"

import {iconDecorative} from "../src/rules/icon-decorative"

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

describe("icon-decorative", () => {
  describe("invalid cases", () => {
    ruleTester.run("missing accessibility", iconDecorative, {
      invalid: [
        {
          code: `
            import {Icon} from "@qualcomm-ui/react"
            const App = () => <Icon icon={Search} />
          `,
          errors: [{messageId: "missingAccessibility"}],
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react"
            const App = () => <Icon icon={Search} aria-label="" />
          `,
          errors: [{messageId: "missingAccessibility"}],
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react"
            const App = () => <Icon icon={Search} aria-hidden="false" />
          `,
          errors: [{messageId: "missingAccessibility"}],
        },
        {
          code: `
            import {Icon as QIcon} from "@qualcomm-ui/react"
            const App = () => <QIcon icon={Search} />
          `,
          errors: [{messageId: "missingAccessibility"}],
        },
        {
          code: `
            import * as QUI from "@qualcomm-ui/react"
            const App = () => <QUI.Icon icon={Search} />
          `,
          errors: [{messageId: "missingAccessibility"}],
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react-internal"
            const App = () => <Icon icon={Search} />
          `,
          errors: [{messageId: "missingAccessibility"}],
        },
      ],
      valid: [],
    })
  })

  describe("decorative icons", () => {
    ruleTester.run("aria-hidden", iconDecorative, {
      invalid: [],
      valid: [
        {
          code: `
            import {Icon} from "@qualcomm-ui/react"
            const App = () => <Icon icon={Search} aria-hidden="true" />
          `,
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react"
            const App = () => <Icon icon={Search} aria-hidden={true} />
          `,
        },
        {
          code: `
            import {Icon as QIcon} from "@qualcomm-ui/react"
            const App = () => <QIcon icon={Search} aria-hidden="true" />
          `,
        },
      ],
    })
  })

  describe("meaningful icons", () => {
    ruleTester.run("aria-label", iconDecorative, {
      invalid: [],
      valid: [
        {
          code: `
            import {Icon} from "@qualcomm-ui/react"
            const App = () => <Icon icon={Warning} aria-label="Warning indicator" />
          `,
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react"
            const App = () => <Icon icon={Warning} aria-labelledby="warning-text" />
          `,
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react"
            const App = () => <Icon icon={status} aria-label={statusLabel} />
          `,
        },
        {
          code: `
            import * as QUI from "@qualcomm-ui/react"
            const App = () => <QUI.Icon icon={Warning} aria-label="Warning" />
          `,
        },
      ],
    })
  })

  describe("Icon inside labeled parent", () => {
    ruleTester.run("accessible parent", iconDecorative, {
      invalid: [],
      valid: [
        {
          code: `
            import {Icon, IconButton} from "@qualcomm-ui/react"
            const App = () => (
              <IconButton aria-label="Close">
                <Icon icon={X} />
              </IconButton>
            )
          `,
        },
        {
          code: `
            import {Icon, InlineIconButton} from "@qualcomm-ui/react"
            const App = () => (
              <InlineIconButton aria-label="Search">
                <Icon icon={Search} />
              </InlineIconButton>
            )
          `,
        },
        {
          code: `
            import {Icon, Button} from "@qualcomm-ui/react"
            const App = () => (
              <Button aria-label="Delete">
                <Icon icon={Trash} />
              </Button>
            )
          `,
        },
        {
          code: `
            import {Icon, HeaderBarActionIconButton} from "@qualcomm-ui/react"
            const App = () => (
              <HeaderBarActionIconButton aria-label="Menu">
                <Icon icon={Menu} />
              </HeaderBarActionIconButton>
            )
          `,
        },
        {
          code: `
            import * as QUI from "@qualcomm-ui/react"
            const App = () => (
              <QUI.IconButton aria-label="Close">
                <QUI.Icon icon={X} />
              </QUI.IconButton>
            )
          `,
        },
        {
          code: `
            import {Icon, IconButton} from "@qualcomm-ui/react"
            const App = () => (
              <IconButton aria-labelledby="close-label">
                <Icon icon={X} />
              </IconButton>
            )
          `,
        },
      ],
    })
  })

  describe("Icon inside unlabeled parent", () => {
    ruleTester.run("missing parent label", iconDecorative, {
      invalid: [
        {
          code: `
            import {Icon, IconButton} from "@qualcomm-ui/react"
            const App = () => (
              <IconButton>
                <Icon icon={X} />
              </IconButton>
            )
          `,
          errors: [{messageId: "missingAccessibility"}],
        },
        {
          code: `
            import {Icon, Button} from "@qualcomm-ui/react"
            const App = () => (
              <Button>
                <Icon icon={Trash} />
                Delete
              </Button>
            )
          `,
          errors: [{messageId: "missingAccessibility"}],
        },
      ],
      valid: [],
    })
  })

  describe("non-QUI icons", () => {
    ruleTester.run("ignored", iconDecorative, {
      invalid: [],
      valid: [
        {code: `<Icon icon={Search} />`},
        {
          code: `
            import {Icon} from "other-library"
            const App = () => <Icon icon={Search} />
          `,
        },
        {
          code: `
            const Icon = () => <svg />
            const App = () => <Icon />
          `,
        },
      ],
    })
  })
})
