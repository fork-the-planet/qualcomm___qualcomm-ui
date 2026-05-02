import {Component, output} from "@angular/core"
import {render} from "@testing-library/angular"
import {Plus, Star} from "lucide-angular"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"

import {EndIconDirective} from "@qualcomm-ui/angular/icon"
import {TagDirective} from "@qualcomm-ui/angular/tag"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

describe("Tag", () => {
  test("renders its content as the tag label", async () => {
    @Component({
      imports: [TagDirective],
      template: `
        <span q-tag>Label</span>
      `,
    })
    class TagComponent {}

    await render(TagComponent)

    await expect.element(page.getByText("Label")).toBeVisible()
  })

  test("does not render any icon when startIcon and endIcon are omitted", async () => {
    @Component({
      imports: [TagDirective],
      template: `
        <span q-tag>Label</span>
      `,
    })
    class TagWithoutIconsComponent {}

    await render(TagWithoutIconsComponent)

    await expect.element(page.getByText("Label")).toBeVisible()
    expect(
      page
        .getByText("Label")
        .element()
        .closest("[q-tag]")
        ?.querySelector("svg"),
    ).toBeNull()
  })

  test("renders startIcon visible alongside the label", async () => {
    @Component({
      imports: [TagDirective],
      providers: [provideIcons({Plus})],
      template: `
        <span q-tag startIcon="Plus">Label</span>
      `,
    })
    class StartIconTagComponent {}

    await render(StartIconTagComponent)

    const tag = page.getByText("Label").element().closest("[q-tag]")
    await expect.element(page.getByText("Label")).toBeVisible()
    expect(tag?.querySelector("svg")).toBeTruthy()
  })

  test("renders endIcon visible alongside the label", async () => {
    @Component({
      imports: [TagDirective],
      providers: [provideIcons({Star})],
      template: `
        <span endIcon="Star" q-tag>Label</span>
      `,
    })
    class EndIconTagComponent {}

    await render(EndIconTagComponent)

    const tag = page.getByText("Label").element().closest("[q-tag]")
    await expect.element(page.getByText("Label")).toBeVisible()
    expect(tag?.querySelector("svg")).toBeTruthy()
  })

  test("ignores endIcon when variant is dismissable and renders a Dismiss button", async () => {
    @Component({
      imports: [EndIconDirective, TagDirective],
      providers: [provideIcons({Star})],
      template: `
        <span q-tag variant="dismissable">
          Label
          <svg data-test-id="tag-end-icon" icon="Star" q-end-icon></svg>
        </span>
      `,
    })
    class DismissableTagComponent {}

    await render(DismissableTagComponent)

    await expect
      .element(page.getByRole("button", {name: "Dismiss"}))
      .toBeVisible()
    await expect
      .element(page.getByTestId("tag-end-icon"))
      .not.toBeInTheDocument()
  })

  test("fires dismiss output when the Dismiss button is clicked on a dismissable tag", async () => {
    const dismissed = vi.fn()

    @Component({
      imports: [TagDirective],
      template: `
        <span q-tag variant="dismissable" (dismiss)="dismissed.emit()">
          Label
        </span>
      `,
    })
    class DismissableTagWithOutputComponent {
      readonly dismissed = output<void>()
    }

    await render(DismissableTagWithOutputComponent, {
      on: {
        dismissed,
      },
    })

    await page.getByRole("button", {name: "Dismiss"}).click()

    await expect.poll(() => dismissed).toHaveBeenCalledTimes(1)
  })

  test("exposes a selectable tag as a button with an accessible name", async () => {
    @Component({
      imports: [TagDirective],
      template: `
        <button q-tag variant="selectable">Label</button>
      `,
    })
    class SelectableTagComponent {}

    await render(SelectableTagComponent)

    await expect
      .element(page.getByRole("button", {name: "Label"}))
      .toBeVisible()
  })

  test("does not expose a default tag as a button", async () => {
    @Component({
      imports: [TagDirective],
      template: `
        <span q-tag>Label</span>
      `,
    })
    class DefaultTagComponent {}

    await render(DefaultTagComponent)

    await expect.element(page.getByText("Label")).toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "Label"}))
      .not.toBeInTheDocument()
  })

  test("composes user click output with selectable tag state changes", async () => {
    const clicked = vi.fn()

    @Component({
      imports: [TagDirective],
      template: `
        <button q-tag variant="selectable" (click)="clicked.emit()">
          Label
        </button>
      `,
    })
    class SelectableTagWithOutputComponent {
      readonly clicked = output<void>()
    }

    await render(SelectableTagWithOutputComponent, {
      on: {
        clicked,
      },
    })

    const tag = page.getByRole("button", {name: "Label"})
    expect(tag).not.toHaveAttribute("data-selected")

    await tag.click()

    await expect.poll(() => clicked).toHaveBeenCalledTimes(1)
    expect(tag).toHaveAttribute("data-selected", "")
  })

  test("disables a selectable tag from receiving clicks when disabled", async () => {
    const clicked = vi.fn()

    @Component({
      imports: [TagDirective],
      template: `
        <button disabled q-tag variant="selectable" (click)="clicked.emit()">
          Label
        </button>
      `,
    })
    class DisabledSelectableTagComponent {
      readonly clicked = output<void>()
    }

    await render(DisabledSelectableTagComponent, {
      on: {
        clicked,
      },
    })

    const tag = page.getByRole("button", {name: "Label"})
    await expect.element(tag).toBeDisabled()

    await tag.click({force: true}).catch(() => {})

    expect(clicked).not.toHaveBeenCalled()
  })

  test("disables the Dismiss button on a disabled dismissable tag", async () => {
    const dismissed = vi.fn()

    @Component({
      imports: [TagDirective],
      template: `
        <span disabled q-tag variant="dismissable" (dismiss)="dismissed.emit()">
          Label
        </span>
      `,
    })
    class DisabledDismissableTagComponent {
      readonly dismissed = output<void>()
    }

    await render(DisabledDismissableTagComponent, {
      on: {
        dismissed,
      },
    })

    const dismissButton = page.getByRole("button", {name: "Dismiss"})
    await expect.element(dismissButton).toBeDisabled()

    await dismissButton.click({force: true}).catch(() => {})

    expect(dismissed).not.toHaveBeenCalled()
  })
})
