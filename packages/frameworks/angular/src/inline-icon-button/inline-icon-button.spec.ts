import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {Search} from "lucide-angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"

describe("InlineIconButton", () => {
  test("renders as a button with a default icon", async () => {
    @Component({
      imports: [InlineIconButtonComponent],
      template: `
        <button
          aria-label="Dismiss"
          q-inline-icon-button
          type="button"
        ></button>
      `,
    })
    class DefaultInlineIconButtonComponent {}

    await render(DefaultInlineIconButtonComponent)

    const button = page.getByRole("button", {name: "Dismiss"})
    await expect.element(button).toBeVisible()
    expect(button.element().querySelector("svg")).toBeTruthy()
    expect(button).toHaveAttribute("data-emphasis", "neutral")
    expect(button).toHaveAttribute("data-size", "md")
    expect(button).toHaveAttribute("data-variant", "fixed")
  })

  test("applies configured bindings to the button and icon", async () => {
    @Component({
      imports: [InlineIconButtonComponent],
      template: `
        <button
          aria-label="Search"
          emphasis="brand"
          q-inline-icon-button
          size="sm"
          type="button"
          variant="scale"
          [icon]="icon"
        ></button>
      `,
    })
    class ConfiguredInlineIconButtonComponent {
      readonly icon = Search
    }

    await render(ConfiguredInlineIconButtonComponent)

    const button = page.getByRole("button", {name: "Search"})
    const icon = button.element().querySelector("svg")
    expect(button).toHaveAttribute("data-emphasis", "brand")
    expect(button).toHaveAttribute("data-size", "sm")
    expect(button).toHaveAttribute("data-variant", "scale")
    expect(icon).toHaveAttribute("data-emphasis", "brand")
    expect(icon).toHaveAttribute("data-size", "sm")
    expect(icon).toHaveAttribute("data-variant", "scale")
  })
})
