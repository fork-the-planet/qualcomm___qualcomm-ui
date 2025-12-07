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
            import {Icon} from "@qualcomm-ui/react/icon"
            const App = () => <Icon icon={Search} />
          `,
          errors: [{messageId: "missingAccessibility"}],
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react/icon"
            const App = () => <Icon icon={Search} aria-label="" />
          `,
          errors: [{messageId: "missingAccessibility"}],
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react/icon"
            const App = () => <Icon icon={Search} aria-hidden="false" />
          `,
          errors: [{messageId: "missingAccessibility"}],
        },
        {
          code: `
            import {Icon as QIcon} from "@qualcomm-ui/react/icon"
            const App = () => <QIcon icon={Search} />
          `,
          errors: [{messageId: "missingAccessibility"}],
        },
        {
          code: `
            import * as IconMod from "@qualcomm-ui/react/icon"
            const App = () => <IconMod.Icon icon={Search} />
          `,
          errors: [{messageId: "missingAccessibility"}],
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react-internal/icon"
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
            import {Icon} from "@qualcomm-ui/react/icon"
            const App = () => <Icon icon={Search} aria-hidden="true" />
          `,
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react/icon"
            const App = () => <Icon icon={Search} aria-hidden={true} />
          `,
        },
        {
          code: `
            import {Icon as QIcon} from "@qualcomm-ui/react/icon"
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
            import {Icon} from "@qualcomm-ui/react/icon"
            const App = () => <Icon icon={Warning} aria-label="Warning indicator" />
          `,
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react/icon"
            const App = () => <Icon icon={Warning} aria-labelledby="warning-text" />
          `,
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react/icon"
            const App = () => <Icon icon={status} aria-label={statusLabel} />
          `,
        },
        {
          code: `
            import * as IconMod from "@qualcomm-ui/react/icon"
            const App = () => <IconMod.Icon icon={Warning} aria-label="Warning" />
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
            import {Icon} from "@qualcomm-ui/react/icon"
            import {IconButton} from "@qualcomm-ui/react/button"
            const App = () => (
              <IconButton aria-label="Close">
                <Icon icon={X} />
              </IconButton>
            )
          `,
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react/icon"
            import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
            const App = () => (
              <InlineIconButton aria-label="Search">
                <Icon icon={Search} />
              </InlineIconButton>
            )
          `,
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react/icon"
            import {Button} from "@qualcomm-ui/react/button"
            const App = () => (
              <Button aria-label="Delete">
                <Icon icon={Trash} />
              </Button>
            )
          `,
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react/icon"
            import {HeaderBarActionIconButton} from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <HeaderBarActionIconButton aria-label="Menu">
                <Icon icon={Menu} />
              </HeaderBarActionIconButton>
            )
          `,
        },
        {
          code: `
            import * as IconMod from "@qualcomm-ui/react/icon"
            import * as Button from "@qualcomm-ui/react/button"
            const App = () => (
              <Button.IconButton aria-label="Close">
                <IconMod.Icon icon={X} />
              </Button.IconButton>
            )
          `,
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react/icon"
            import {IconButton} from "@qualcomm-ui/react/button"
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
            import {Icon} from "@qualcomm-ui/react/icon"
            import {IconButton} from "@qualcomm-ui/react/button"
            const App = () => (
              <IconButton>
                <Icon icon={X} />
              </IconButton>
            )
          `,
          errors: [{messageId: "missingAccessibility"}],
        },
      ],
      valid: [],
    })
  })

  describe("Icon with adjacent text content", () => {
    ruleTester.run("text provides accessibility", iconDecorative, {
      invalid: [],
      valid: [
        {
          code: `
            import {Icon} from "@qualcomm-ui/react/icon"
            import {Button} from "@qualcomm-ui/react/button"
            const App = () => (
              <Button>
                <Icon icon={Trash} />
                Delete
              </Button>
            )
          `,
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react/icon"
            import {Button} from "@qualcomm-ui/react/button"
            const App = () => (
              <Button>
                <Icon icon={Plus} />
                {buttonLabel}
              </Button>
            )
          `,
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react/icon"
            const App = () => (
              <span>
                <Icon icon={Info} />
                Information
              </span>
            )
          `,
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react/icon"
            const App = () => (
              <div>
                <Icon icon={Warning} />
                {warningMessage}
              </div>
            )
          `,
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react/icon"
            const App = () => (
              <div>
                <div><Icon icon={Logo} /></div>
                <span>App Title</span>
              </div>
            )
          `,
        },
        {
          code: `
            import {Icon} from "@qualcomm-ui/react/icon"
            const App = () => (
              <nav>
                <div className="wrapper">
                  <Icon icon={Menu} />
                </div>
                <Title>Navigation</Title>
              </nav>
            )
          `,
        },
      ],
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
