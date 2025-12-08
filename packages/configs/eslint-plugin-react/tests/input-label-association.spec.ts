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
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => <TextInput />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {NumberInput} from "@qualcomm-ui/react/number-input"
            const App = () => <NumberInput />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {Select} from "@qualcomm-ui/react/select"
            const App = () => <Select />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {Combobox} from "@qualcomm-ui/react/combobox"
            const App = () => <Combobox />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {Switch} from "@qualcomm-ui/react/switch"
            const App = () => <Switch />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {Checkbox} from "@qualcomm-ui/react/checkbox"
            const App = () => <Checkbox />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {Radio} from "@qualcomm-ui/react/radio"
            const App = () => <Radio />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => <TextInput label="" />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => <TextInput inputProps={{"aria-label": ""}} />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => <TextInput inputProps={{}} />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react-internal/text-input"
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
            import {TextInput} from "@qualcomm-ui/react/text-input"
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
            import * as QUI from "@qualcomm-ui/react/text-input"
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
            import {TextInput as TI} from "@qualcomm-ui/react/text-input"
            const App = () => <TI />
          `,
          errors: [{messageId: "missingLabel"}],
        },
        {
          code: `
            import * as QUI from "@qualcomm-ui/react/text-input"
            const App = () => <QUI.TextInput />
          `,
          errors: [{messageId: "missingLabel"}],
        },
      ],
      valid: [
        {
          code: `
            import {TextInput as TI} from "@qualcomm-ui/react/text-input"
            const App = () => <TI label="Email" />
          `,
        },
        {
          code: `
            import {TextInput as TI} from "@qualcomm-ui/react/text-input"
            const App = () => <TI inputProps={{"aria-label": "Email"}} />
          `,
        },
        {
          code: `
            import {TextInput as TI} from "@qualcomm-ui/react/text-input"
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
            import * as QUI from "@qualcomm-ui/react/text-input"
            const App = () => <QUI.TextInput label="Email" />
          `,
        },
        {
          code: `
            import * as QUI from "@qualcomm-ui/react/text-input"
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
    ruleTester.run("with label prop", inputLabelAssociation, {
      invalid: [],
      valid: [
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => <TextInput label="Email address" />
          `,
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => <TextInput label={emailLabel} />
          `,
        },
        {
          code: `
            import {NumberInput} from "@qualcomm-ui/react/number-input"
            const App = () => <NumberInput label="Quantity" />
          `,
        },
        {
          code: `
            import {Select} from "@qualcomm-ui/react/select"
            const App = () => <Select label="Choose option" />
          `,
        },
        {
          code: `
            import {Switch} from "@qualcomm-ui/react/switch"
            const App = () => <Switch label="Enable notifications" />
          `,
        },
        {
          code: `
            import {Checkbox} from "@qualcomm-ui/react/checkbox"
            const App = () => <Checkbox label="Accept terms" />
          `,
        },
      ],
    })

    ruleTester.run("with inputProps aria-label", inputLabelAssociation, {
      invalid: [],
      valid: [
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => <TextInput inputProps={{"aria-label": "Email"}} />
          `,
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => <TextInput inputProps={{"aria-labelledby": "email-label"}} />
          `,
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => <TextInput inputProps={{ariaLabel: "Email"}} />
          `,
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => <TextInput inputProps={{ariaLabelledby: "email-label"}} />
          `,
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => <TextInput inputProps={{"aria-label": label}} />
          `,
        },
        {
          code: `
            import {NumberInput} from "@qualcomm-ui/react/number-input"
            const App = () => <NumberInput inputProps={{"aria-label": "Quantity"}} />
          `,
        },
        {
          code: `
            import {Combobox} from "@qualcomm-ui/react/combobox"
            const App = () => <Combobox controlProps={{"aria-label": "Country"}} />
          `,
        },
      ],
    })

    ruleTester.run("with controlProps aria-label", inputLabelAssociation, {
      invalid: [],
      valid: [
        {
          code: `
            import {Select} from "@qualcomm-ui/react/select"
            const App = () => <Select controlProps={{"aria-label": "City"}} />
          `,
        },
        {
          code: `
            import {Select} from "@qualcomm-ui/react/select"
            const App = () => <Select controlProps={{"aria-labelledby": "city-label"}} />
          `,
        },
        {
          code: `
            import {Select} from "@qualcomm-ui/react/select"
            const App = () => <Select controlProps={{ariaLabel: label}} />
          `,
        },
      ],
    })

    ruleTester.run("with hiddenInputProps aria-label", inputLabelAssociation, {
      invalid: [],
      valid: [
        {
          code: `
            import {Switch} from "@qualcomm-ui/react/switch"
            const App = () => <Switch hiddenInputProps={{"aria-label": "Toggle"}} />
          `,
        },
        {
          code: `
            import {Checkbox} from "@qualcomm-ui/react/checkbox"
            const App = () => <Checkbox hiddenInputProps={{"aria-labelledby": "checkbox-label"}} />
          `,
        },
      ],
    })

    ruleTester.run("with direct aria-label attribute", inputLabelAssociation, {
      invalid: [],
      valid: [
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => <TextInput aria-label="Email" />
          `,
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => <TextInput aria-labelledby="email-label" />
          `,
        },
        {
          code: `
            import {Switch} from "@qualcomm-ui/react/switch"
            const App = () => <Switch aria-label="Toggle feature" />
          `,
        },
        {
          code: `
            import {Select} from "@qualcomm-ui/react/select"
            const App = () => <Select aria-label="Country" />
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
            import {TextInput} from "@qualcomm-ui/react/text-input"
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
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => (
              <TextInput.Root>
                <TextInput.Input aria-labelledby="email-label" />
              </TextInput.Root>
            )
          `,
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => (
              <TextInput.Root>
                <div className="flex">
                  <TextInput.Label>Project Name</TextInput.Label>
                  <TextInput.InputGroup>
                    <TextInput.Input />
                  </TextInput.InputGroup>
                </div>
              </TextInput.Root>
            )
          `,
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => (
              <TextInput.Root>
                <div>
                  <div>
                    <span>
                      <TextInput.Label>Deeply nested</TextInput.Label>
                    </span>
                  </div>
                </div>
                <TextInput.Input />
              </TextInput.Root>
            )
          `,
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => (
              <TextInput.Root>
                <div>
                  <>
                    <TextInput.Label>In Fragment</TextInput.Label>
                  </>
                  <TextInput.Input />
                </div>
              </TextInput.Root>
            )
          `,
        },
      ],
    })

    ruleTester.run("with aria-label on HiddenInput", inputLabelAssociation, {
      invalid: [],
      valid: [
        {
          code: `
            import {Switch} from "@qualcomm-ui/react/switch"
            const App = () => (
              <Switch.Root>
                <Switch.HiddenInput aria-label="Toggle feature" />
                <Switch.Control />
              </Switch.Root>
            )
          `,
        },
        {
          code: `
            import {Switch} from "@qualcomm-ui/react/switch"
            const App = () => (
              <Switch.Root>
                <Switch.HiddenInput aria-labelledby="switch-label" />
                <Switch.Control />
              </Switch.Root>
            )
          `,
        },
        {
          code: `
            import {Checkbox} from "@qualcomm-ui/react/checkbox"
            const App = () => (
              <Checkbox.Root>
                <Checkbox.HiddenInput aria-label="Accept terms" />
                <Checkbox.Control />
              </Checkbox.Root>
            )
          `,
        },
        {
          code: `
            import {TextInput} from "@qualcomm-ui/react/text-input"
            const App = () => (
              <TextInput.Root>
                <TextInput.InputGroup>
                  <TextInput.Input aria-label="Nested input" />
                </TextInput.InputGroup>
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
            import {Button} from "@qualcomm-ui/react/button"
            const App = () => <Button>Click me</Button>
          `,
        },
      ],
    })
  })
})
