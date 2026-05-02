import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {CheckmarkIconComponent} from "@qualcomm-ui/angular/checkmark"

const sizes = ["sm", "md", "lg"] as const

describe("CheckmarkIcon", () => {
  test("renders a visible checked icon at each supported size", async () => {
    @Component({
      imports: [CheckmarkIconComponent],
      template: `
        @for (size of sizes; track size) {
          <q-checkmark-icon
            [attr.data-test-id]="'checkmark-icon-' + size"
            [size]="size"
          />
        }
      `,
    })
    class CheckedIconComponent {
      protected readonly sizes = sizes
    }

    const {container} = await render(CheckedIconComponent)

    for (const size of sizes) {
      await expect
        .element(page.getByTestId(`checkmark-icon-${size}`))
        .toBeVisible()
    }
    expect(
      container.querySelectorAll("svg[data-checkmark-part='indicator-icon']"),
    ).toHaveLength(sizes.length)
  })

  test("renders a visible indeterminate icon at each supported size", async () => {
    @Component({
      imports: [CheckmarkIconComponent],
      template: `
        @for (size of sizes; track size) {
          <q-checkmark-icon
            indeterminate
            [attr.data-test-id]="'checkmark-icon-' + size"
            [size]="size"
          />
        }
      `,
    })
    class IndeterminateIconComponent {
      protected readonly sizes = sizes
    }

    const {container} = await render(IndeterminateIconComponent)

    for (const size of sizes) {
      await expect
        .element(page.getByTestId(`checkmark-icon-${size}`))
        .toBeVisible()
    }
    expect(
      container.querySelectorAll("svg[data-checkmark-part='indicator-icon']"),
    ).toHaveLength(sizes.length)
  })

  test("can expose an aria-label through the host element", async () => {
    @Component({
      imports: [CheckmarkIconComponent],
      template: `
        <q-checkmark-icon aria-label="Checked" role="img" />
      `,
    })
    class AriaLabelCheckmarkIconComponent {}

    await render(AriaLabelCheckmarkIconComponent)

    await expect.element(page.getByRole("img", {name: "Checked"})).toBeVisible()
  })
})
