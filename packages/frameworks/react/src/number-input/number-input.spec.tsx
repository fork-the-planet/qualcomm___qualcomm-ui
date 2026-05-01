import {useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"
import {render} from "vitest-browser-react"

import {
  NumberInput,
  type UnitOption,
} from "@qualcomm-ui/react/number-input"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const demoLabel = "Demo Label"
const demoPlaceholder = "Enter a number"
const demoHint = "This is a helpful hint"
const demoErrorText = "This field is required"

const incrementLabel = "increment value"
const decrementLabel = "decrease value"

const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <NumberInput.Root defaultValue="5">
          <NumberInput.Label>{demoLabel}</NumberInput.Label>
          <NumberInput.InputGroup>
            <NumberInput.Input placeholder={demoPlaceholder} />
            <NumberInput.Control />
          </NumberInput.InputGroup>
        </NumberInput.Root>
      )
    },
    simple() {
      return (
        <NumberInput
          defaultValue="5"
          label={demoLabel}
          placeholder={demoPlaceholder}
        />
      )
    },
    testCase: (getComponent) => {
      test("Renders label and default value", async () => {
        await render(getComponent())
        await expect.element(page.getByText(demoLabel)).toBeVisible()
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeVisible()
        await expect.element(input).toHaveValue("5")
        await expect
          .element(input)
          .toHaveAttribute("placeholder", demoPlaceholder)
      })
    },
  },
  {
    composite() {
      return (
        <NumberInput.Root>
          <NumberInput.Label>{demoLabel}</NumberInput.Label>
          <NumberInput.InputGroup>
            <NumberInput.Input placeholder={demoPlaceholder} />
            <NumberInput.Control />
          </NumberInput.InputGroup>
        </NumberInput.Root>
      )
    },
    simple() {
      return (
        <NumberInput label={demoLabel} placeholder={demoPlaceholder} />
      )
    },
    testCase: (getComponent) => {
      test("Typing a number updates the input value", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await input.fill("42")
        await expect.element(input).toHaveValue("42")
      })
    },
  },
  {
    composite() {
      return (
        <NumberInput.Root defaultValue="1">
          <NumberInput.Label>{demoLabel}</NumberInput.Label>
          <NumberInput.InputGroup>
            <NumberInput.Input />
            <NumberInput.Control />
          </NumberInput.InputGroup>
        </NumberInput.Root>
      )
    },
    simple() {
      return <NumberInput defaultValue="1" label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("Increment trigger increases value by step", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("1")
        await page.getByRole("button", {name: incrementLabel}).click()
        await expect.element(input).toHaveValue("2")
      })
    },
  },
  {
    composite() {
      return (
        <NumberInput.Root defaultValue="5">
          <NumberInput.Label>{demoLabel}</NumberInput.Label>
          <NumberInput.InputGroup>
            <NumberInput.Input />
            <NumberInput.Control />
          </NumberInput.InputGroup>
        </NumberInput.Root>
      )
    },
    simple() {
      return <NumberInput defaultValue="5" label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("Decrement trigger decreases value by step", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("5")
        await page.getByRole("button", {name: decrementLabel}).click()
        await expect.element(input).toHaveValue("4")
      })
    },
  },
  {
    composite() {
      return (
        <NumberInput.Root defaultValue="6" step={2}>
          <NumberInput.Label>{demoLabel}</NumberInput.Label>
          <NumberInput.InputGroup>
            <NumberInput.Input />
            <NumberInput.Control />
          </NumberInput.InputGroup>
        </NumberInput.Root>
      )
    },
    simple() {
      return <NumberInput defaultValue="6" label={demoLabel} step={2} />
    },
    testCase: (getComponent) => {
      test("Custom step increments and decrements by step amount", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("6")
        await page.getByRole("button", {name: incrementLabel}).click()
        await expect.element(input).toHaveValue("8")
        await page.getByRole("button", {name: decrementLabel}).click()
        await expect.element(input).toHaveValue("6")
      })
    },
  },
  {
    composite() {
      return (
        <NumberInput.Root defaultValue="5" max={10} min={5}>
          <NumberInput.Label>{demoLabel}</NumberInput.Label>
          <NumberInput.InputGroup>
            <NumberInput.Input />
            <NumberInput.Control />
          </NumberInput.InputGroup>
        </NumberInput.Root>
      )
    },
    simple() {
      return (
        <NumberInput defaultValue="5" label={demoLabel} max={10} min={5} />
      )
    },
    testCase: (getComponent) => {
      test("Respects min boundary - decrement trigger is disabled at min", async () => {
        await render(getComponent())
        const decrementButton = page.getByRole("button", {
          name: decrementLabel,
        })
        await expect.element(decrementButton).toBeDisabled()
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("5")
      })
    },
  },
  {
    composite() {
      return (
        <NumberInput.Root defaultValue="10" max={10} min={5}>
          <NumberInput.Label>{demoLabel}</NumberInput.Label>
          <NumberInput.InputGroup>
            <NumberInput.Input />
            <NumberInput.Control />
          </NumberInput.InputGroup>
        </NumberInput.Root>
      )
    },
    simple() {
      return (
        <NumberInput defaultValue="10" label={demoLabel} max={10} min={5} />
      )
    },
    testCase: (getComponent) => {
      test("Respects max boundary - increment trigger is disabled at max", async () => {
        await render(getComponent())
        const incrementButton = page.getByRole("button", {
          name: incrementLabel,
        })
        await expect.element(incrementButton).toBeDisabled()
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("10")
      })
    },
  },
  {
    composite() {
      return (
        <NumberInput.Root defaultValue="7">
          <NumberInput.Label>{demoLabel}</NumberInput.Label>
          <NumberInput.InputGroup>
            <NumberInput.Input />
            <NumberInput.Control />
          </NumberInput.InputGroup>
        </NumberInput.Root>
      )
    },
    simple() {
      return <NumberInput defaultValue="7" label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("defaultValue sets initial value", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("7")
      })
    },
  },
  {
    composite() {
      function Component() {
        const [value, setValue] = useState("3")
        return (
          <NumberInput.Root
            onValueChange={({value}) => setValue(value)}
            value={value}
          >
            <NumberInput.Label>{demoLabel}</NumberInput.Label>
            <NumberInput.InputGroup>
              <NumberInput.Input />
              <NumberInput.Control />
            </NumberInput.InputGroup>
          </NumberInput.Root>
        )
      }
      return <Component />
    },
    simple() {
      function Component() {
        const [value, setValue] = useState("3")
        return (
          <NumberInput
            label={demoLabel}
            onValueChange={({value}) => setValue(value)}
            value={value}
          />
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("Controlled value updates via increment trigger", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("3")
        await page.getByRole("button", {name: incrementLabel}).click()
        await expect.element(input).toHaveValue("4")
        await page.getByRole("button", {name: incrementLabel}).click()
        await expect.element(input).toHaveValue("5")
      })
    },
  },
  {
    composite() {
      function Component() {
        const onChange = vi.fn()
        return (
          <NumberInput.Root defaultValue="0" onValueChange={onChange}>
            <NumberInput.Label>{demoLabel}</NumberInput.Label>
            <NumberInput.InputGroup>
              <NumberInput.Input />
              <NumberInput.Control />
            </NumberInput.InputGroup>
          </NumberInput.Root>
        )
      }
      return <Component />
    },
    simple() {
      function Component() {
        const onChange = vi.fn()
        return (
          <NumberInput
            defaultValue="0"
            label={demoLabel}
            onValueChange={onChange}
          />
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("Typing triggers value update", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await input.fill("25")
        await expect.element(input).toHaveValue("25")
      })
    },
  },
  {
    composite() {
      return (
        <NumberInput.Root defaultValue="5" disabled>
          <NumberInput.Label>{demoLabel}</NumberInput.Label>
          <NumberInput.InputGroup>
            <NumberInput.Input />
            <NumberInput.Control />
          </NumberInput.InputGroup>
        </NumberInput.Root>
      )
    },
    simple() {
      return (
        <NumberInput defaultValue="5" disabled label={demoLabel} />
      )
    },
    testCase: (getComponent) => {
      test("Disabled state disables input and triggers", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeDisabled()
        await expect
          .element(page.getByRole("button", {name: incrementLabel}))
          .toBeDisabled()
        await expect
          .element(page.getByRole("button", {name: decrementLabel}))
          .toBeDisabled()
      })
    },
  },
  {
    composite() {
      return (
        <NumberInput.Root defaultValue="5" readOnly>
          <NumberInput.Label>{demoLabel}</NumberInput.Label>
          <NumberInput.InputGroup>
            <NumberInput.Input />
            <NumberInput.Control />
          </NumberInput.InputGroup>
        </NumberInput.Root>
      )
    },
    simple() {
      return (
        <NumberInput defaultValue="5" label={demoLabel} readOnly />
      )
    },
    testCase: (getComponent) => {
      test("ReadOnly state marks input readonly and disables triggers", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveAttribute("readonly")
        await expect.element(input).toHaveValue("5")
        // triggers should not mutate value when readOnly
        await expect
          .element(page.getByRole("button", {name: incrementLabel}))
          .toBeDisabled()
        await expect
          .element(page.getByRole("button", {name: decrementLabel}))
          .toBeDisabled()
      })
    },
  },
  {
    composite() {
      return (
        <NumberInput.Root invalid>
          <NumberInput.Label>{demoLabel}</NumberInput.Label>
          <NumberInput.InputGroup>
            <NumberInput.Input />
            <NumberInput.Control />
            <NumberInput.ErrorIndicator />
          </NumberInput.InputGroup>
          <NumberInput.ErrorText>{demoErrorText}</NumberInput.ErrorText>
        </NumberInput.Root>
      )
    },
    simple() {
      return (
        <NumberInput
          errorText={demoErrorText}
          invalid
          label={demoLabel}
        />
      )
    },
    testCase: (getComponent) => {
      test("Invalid state shows error text and aria-invalid", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveAttribute("aria-invalid", "true")
        await expect.element(page.getByText(demoErrorText)).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <NumberInput.Root>
          <NumberInput.Label>{demoLabel}</NumberInput.Label>
          <NumberInput.InputGroup>
            <NumberInput.Input />
            <NumberInput.Control />
          </NumberInput.InputGroup>
          <NumberInput.Hint>{demoHint}</NumberInput.Hint>
        </NumberInput.Root>
      )
    },
    simple() {
      return <NumberInput hint={demoHint} label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("Hint text is displayed when provided", async () => {
        await render(getComponent())
        await expect.element(page.getByText(demoHint)).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <NumberInput.Root defaultValue="5">
          <NumberInput.Label>{demoLabel}</NumberInput.Label>
          <NumberInput.InputGroup>
            <NumberInput.Input />
            <NumberInput.Control>
              <NumberInput.DecrementTrigger />
              <NumberInput.IncrementTrigger />
            </NumberInput.Control>
          </NumberInput.InputGroup>
        </NumberInput.Root>
      )
    },
    simple() {
      return <NumberInput defaultValue="5" label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("All parts render correctly", async () => {
        await render(getComponent())
        await expect.element(page.getByText(demoLabel)).toBeVisible()
        await expect.element(page.getByLabelText(demoLabel)).toBeVisible()
        await expect
          .element(page.getByRole("button", {name: incrementLabel}))
          .toBeVisible()
        await expect
          .element(page.getByRole("button", {name: decrementLabel}))
          .toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <NumberInput.Root defaultValue="5">
          <NumberInput.Label>{demoLabel}</NumberInput.Label>
          <NumberInput.InputGroup>
            <NumberInput.Input />
            <NumberInput.Control />
          </NumberInput.InputGroup>
        </NumberInput.Root>
      )
    },
    simple() {
      return <NumberInput defaultValue="5" label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("Arrow up key increments, arrow down decrements", async () => {
        await render(getComponent())
        const input = page.getByLabelText(demoLabel)
        await input.click()
        await expect.element(input).toHaveFocus()
        await expect.element(input).toHaveValue("5")
        await input.element().dispatchEvent(
          new KeyboardEvent("keydown", {bubbles: true, key: "ArrowUp"}),
        )
        await expect.element(input).toHaveValue("6")
        await input.element().dispatchEvent(
          new KeyboardEvent("keydown", {bubbles: true, key: "ArrowDown"}),
        )
        await expect.element(input).toHaveValue("5")
      })
    },
  },
]

const unitOptions: UnitOption[] = [
  {label: "$", value: "USD"},
  {label: "€", value: "EUR"},
]

const unitSelectTests: MultiComponentTestCase[] = [
  {
    simple() {
      return (
        <NumberInput
          defaultUnit="USD"
          defaultValue="0"
          label={demoLabel}
          unitOptions={unitOptions}
        />
      )
    },
    testCase: (getComponent) => {
      test("UnitSelect renders selected default unit", async () => {
        await render(getComponent())
        // the unit trigger button surfaces the selected unit's short label
        await expect
          .element(page.getByRole("button").filter({hasText: "$"}))
          .toBeVisible()
      })
    },
  },
]

describe("NumberInput", () => {
  runTests(tests)
  runTests(unitSelectTests)
})
