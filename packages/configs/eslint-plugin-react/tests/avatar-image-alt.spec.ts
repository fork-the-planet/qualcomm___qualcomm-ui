import {RuleTester} from "@typescript-eslint/rule-tester"
import tseslint from "typescript-eslint"
import {afterAll, describe, it} from "vitest"

import {avatarImageAlt} from "../src/rules/avatar-image-alt"

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

describe("avatar-image-alt", () => {
  describe("invalid cases", () => {
    ruleTester.run("missing alt", avatarImageAlt, {
      invalid: [
        {
          code: `
            import {Avatar} from "@qualcomm-ui/react/avatar"
            const App = () => (
              <Avatar.Root>
                <Avatar.Image src="/user.jpg" />
              </Avatar.Root>
            )
          `,
          errors: [{messageId: "missingAlt"}],
        },
        {
          code: `
            import {Avatar} from "@qualcomm-ui/react/avatar"
            const App = () => <Avatar.Image src="/user.jpg" />
          `,
          errors: [{messageId: "missingAlt"}],
        },
        {
          code: `
            import {Avatar} from "@qualcomm-ui/react/avatar"
            const App = () => <Avatar.Image alt="" src="/user.jpg" />
          `,
          errors: [{messageId: "missingAlt"}],
        },
        {
          code: `
            import {Avatar} from "@qualcomm-ui/react/avatar"
            const App = () => <Avatar.Image alt={""} src="/user.jpg" />
          `,
          errors: [{messageId: "missingAlt"}],
        },
        {
          code: `
            import {Avatar as UserAvatar} from "@qualcomm-ui/react/avatar"
            const App = () => <UserAvatar.Image src="/user.jpg" />
          `,
          errors: [{messageId: "missingAlt"}],
        },
        {
          code: `
            import * as QUI from "@qualcomm-ui/react/avatar"
            const App = () => <QUI.Avatar.Image src="/user.jpg" />
          `,
          errors: [{messageId: "missingAlt"}],
        },
        {
          code: `
            import {Avatar} from "@qualcomm-ui/react-internal/avatar"
            const App = () => <Avatar.Image src="/user.jpg" />
          `,
          errors: [{messageId: "missingAlt"}],
        },
      ],
      valid: [],
    })
  })

  describe("valid cases", () => {
    ruleTester.run("with alt", avatarImageAlt, {
      invalid: [],
      valid: [
        {
          code: `
            import {Avatar} from "@qualcomm-ui/react/avatar"
            const App = () => (
              <Avatar.Root>
                <Avatar.Image alt="John Doe" src="/user.jpg" />
              </Avatar.Root>
            )
          `,
        },
        {
          code: `
            import {Avatar} from "@qualcomm-ui/react/avatar"
            const App = () => <Avatar.Image alt="Profile picture" src="/user.jpg" />
          `,
        },
        {
          code: `
            import {Avatar} from "@qualcomm-ui/react/avatar"
            const App = () => <Avatar.Image alt={userName} src="/user.jpg" />
          `,
        },
        {
          code: `
            import {Avatar as UserAvatar} from "@qualcomm-ui/react/avatar"
            const App = () => <UserAvatar.Image alt="User" src="/user.jpg" />
          `,
        },
        {
          code: `
            import * as QUI from "@qualcomm-ui/react/avatar"
            const App = () => <QUI.Avatar.Image alt="User" src="/user.jpg" />
          `,
        },
      ],
    })
  })

  describe("non-QUI components", () => {
    ruleTester.run("ignored", avatarImageAlt, {
      invalid: [],
      valid: [
        {code: `<Avatar.Image src="/user.jpg" />`},
        {
          code: `
            import {Avatar} from "other-library"
            const App = () => <Avatar.Image src="/user.jpg" />
          `,
        },
        {
          code: `
            const Avatar = {Image: () => <img />}
            const App = () => <Avatar.Image src="/user.jpg" />
          `,
        },
      ],
    })
  })
})
