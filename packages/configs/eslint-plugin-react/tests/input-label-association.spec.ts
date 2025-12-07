import {RuleTester} from "@typescript-eslint/rule-tester"
import tseslint from "typescript-eslint"
import {afterAll, describe, it} from "vitest"

import {inputLabelAssociation} from "../src/rules/input-label-association"

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

describe("input-label-association", () => {
  describe("simple components without label", () => {
    ruleTester.run("missing label", inputLabelAssociation, {
      invalid: [
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react"
            const App = () => <TextInput />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {NumberInput} from "@qualcomm-ui/react"
            const App = () => <NumberInput />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {Select} from "@qualcomm-ui/react"
            const App = () => <Select />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {Combobox} from "@qualcomm-ui/react"
            const App = () => <Combobox />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {Slider} from "@qualcomm-ui/react"
            const App = () => <Slider />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {Switch} from "@qualcomm-ui/react"
            const App = () => <Switch />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {Checkbox} from "@qualcomm-ui/react"
            const App = () => <Checkbox />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {Radio} from "@qualcomm-ui/react"
            const App = () => <Radio />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react"
            const App = () => <TextInput aria-label="" />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react-internal"
            const App = () => <TextInput />
          `,
          errors: [{messageId: "missingLabel"}],
        },
      ],
      valid: [],
    })
  })

  describe("compound components without label", () => {
    ruleTester.run("missing Label child", inputLabelAssociation, {
      invalid: [
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react"
            const App = () => (
              <TextInput.Root>
                <TextInput.Input />
              </TextInput.Root>
            )
          `,
          errors: [{messageId: "missingLabelChild"}],
        },
        {
          code: `
            import * as QUI from "@qualcomm-ui/react"
            const App = () => (
              <QUI.TextInput.Root>
                <QUI.TextInput.Input />
              </QUI.TextInput.Root>
            )
          `,
          errors: [{messageId: "missingLabelChild"}],
        },
      ],
      valid: [],
    })
  })

  describe("aliased and namespace imports", () => {
    ruleTester.run("import variations", inputLabelAssociation, {
      invalid: [
        {
          code: `
            import {TextInput as TI} from "@qualcomm-ui/react"
            const App = () => <TI />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import * as QUI from "@qualcomm-ui/react"
            const App = () => <QUI.TextInput />
          `,
          errors: [{messageId: "missingLabel"}],
        },
      ],
      valid: [
        {
          code: `
            import {TextInput as TI} from "@qualcomm-ui/react"
            const App = () => <TI aria-label="Email" />
          `,
        },
        {
          code: `
            import {TextInput as TI} from "@qualcomm-ui/react"
            const App = () => (
              <TI.Root>
                <TI.Label>Email</TI.Label>
                <TI.Input />
              </TI.Root>
            )
          `,
        },
        {
          code: `
            import * as QUI from "@qualcomm-ui/react"
            const App = () => <QUI.TextInput aria-label="Email" />
          `,
        },
        {
          code: `
            import * as QUI from "@qualcomm-ui/react"
            const App = () => (
              <QUI.TextInput.Root>
                <QUI.TextInput.Label>Email</QUI.TextInput.Label>
                <QUI.TextInput.Input />
              </QUI.TextInput.Root>
            )
          `,
        },
      ],
    })
  })

  describe("valid simple components", () => {
    ruleTester.run("with aria-label", inputLabelAssociation, {
      invalid: [],
      valid: [
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react"
            const App = () => <TextInput aria-label="Email address" />
          `,
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react"
            const App = () => <TextInput aria-labelledby="email-label" />
          `,
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react"
            const App = () => <TextInput aria-label={label} />
          `,
        },
        {
          code: `
            import {NumberInput} from "@qualcomm-ui/react"
            const App = () => <NumberInput aria-label="Quantity" />
          `,
        },
        {
          code: `
            import {Select} from "@qualcomm-ui/react"
            const App = () => <Select aria-label="Choose option" />
          `,
        },
        {
          code: `
            import {Slider} from "@qualcomm-ui/react"
            const App = () => <Slider aria-label="Volume" />
          `,
        },
        {
          code: `
            import {Switch} from "@qualcomm-ui/react"
            const App = () => <Switch aria-label="Enable notifications" />
          `,
        },
        {
          code: `
            import {Checkbox} from "@qualcomm-ui/react"
            const App = () => <Checkbox aria-label="Accept terms" />
          `,
        },
      ],
    })
  })

  describe("valid compound components", () => {
    ruleTester.run("with Label child", inputLabelAssociation, {
      invalid: [],
      valid: [
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react"
            const App = () => (
              <TextInput.Root>
                <TextInput.Label>Email</TextInput.Label>
                <TextInput.Input />
              </TextInput.Root>
            )
          `,
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react"
            const App = () => (
              <TextInput.Root aria-labelledby="email-label">
                <TextInput.Input />
              </TextInput.Root>
            )
          `,
        },
      ],
    })
  })

  describe("non-QUI components", () => {
    ruleTester.run("ignored", inputLabelAssociation, {
      invalid: [],
      valid: [
        {code: `<TextInput />`},
        {
          code: `
            import {TextInput} from "other-library"
            const App = () => <TextInput />
          `,
        },
        {
          code: `
            const TextInput = () => <input />
            const App = () => <TextInput />
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
