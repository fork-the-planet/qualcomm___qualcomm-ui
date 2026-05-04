import {Plus, Star} from "lucide-react"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"
import {render} from "vitest-browser-react"

import {Tag} from "@qualcomm-ui/react/tag"

const startIconTestId = "tag-start-icon"
const endIconTestId = "tag-end-icon"

describe("Tag", () => {
  test("renders its children as the tag label", async () => {
    await render(<Tag>Label</Tag>)

    await expect.element(page.getByText("Label")).toBeVisible()
  })

  test("does not render any icon when startIcon and endIcon are omitted", async () => {
    await render(<Tag>Label</Tag>)

    await expect.element(page.getByText("Label")).toBeVisible()
    await expect
      .element(page.getByTestId(startIconTestId))
      .not.toBeInTheDocument()
    await expect
      .element(page.getByTestId(endIconTestId))
      .not.toBeInTheDocument()
  })

  test("renders startIcon visible alongside the label", async () => {
    await render(
      <Tag startIcon={<Plus data-test-id={startIconTestId} />}>Label</Tag>,
    )

    const icon = page.getByTestId(startIconTestId)
    const label = page.getByText("Label")

    await expect.element(icon).toBeVisible()
    await expect.element(label).toBeVisible()
  })

  test("renders endIcon visible alongside the label", async () => {
    await render(
      <Tag endIcon={<Star data-test-id={endIconTestId} />}>Label</Tag>,
    )

    const icon = page.getByTestId(endIconTestId)
    const label = page.getByText("Label")

    await expect.element(icon).toBeVisible()
    await expect.element(label).toBeVisible()
  })

  test("ignores endIcon when variant is dismissable and renders a Dismiss button", async () => {
    await render(
      <Tag
        endIcon={<Star data-test-id={endIconTestId} />}
        variant="dismissable"
      >
        Label
      </Tag>,
    )

    await expect
      .element(page.getByRole("button", {name: "Dismiss"}))
      .toBeVisible()
    await expect
      .element(page.getByTestId(endIconTestId))
      .not.toBeInTheDocument()
  })

  test("fires onDismiss when the Dismiss button is clicked on a dismissable tag", async () => {
    const onDismiss = vi.fn()
    await render(
      <Tag onDismiss={onDismiss} variant="dismissable">
        Label
      </Tag>,
    )

    await page.getByRole("button", {name: "Dismiss"}).click()

    await expect.poll(() => onDismiss.mock.calls.length).toBe(1)
  })

  test("exposes a selectable tag as a button with an accessible name", async () => {
    await render(<Tag variant="selectable">Label</Tag>)

    await expect
      .element(page.getByRole("button", {name: "Label"}))
      .toBeVisible()
  })

  test("does not expose a default tag as a button", async () => {
    await render(<Tag>Label</Tag>)

    await expect.element(page.getByText("Label")).toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "Label"}))
      .not.toBeInTheDocument()
  })

  test("composes user onClick with the internal handler on a selectable tag", async () => {
    const onClick = vi.fn()
    await render(
      <Tag onClick={onClick} variant="selectable">
        Label
      </Tag>,
    )

    await page.getByRole("button", {name: "Label"}).click()

    await expect.poll(() => onClick.mock.calls.length).toBe(1)
  })

  test("disables a selectable tag from receiving clicks when disabled", async () => {
    const onClick = vi.fn()
    await render(
      <Tag disabled onClick={onClick} variant="selectable">
        Label
      </Tag>,
    )

    const tag = page.getByRole("button", {name: "Label"})
    await expect.element(tag).toBeDisabled()

    await tag.click({force: true}).catch(() => {
      // disabled buttons reject pointer events; swallow so the assertion runs
    })

    expect(onClick).not.toHaveBeenCalled()
  })

  test("disables the Dismiss button on a disabled dismissable tag", async () => {
    const onDismiss = vi.fn()
    await render(
      <Tag disabled onDismiss={onDismiss} variant="dismissable">
        Label
      </Tag>,
    )

    const dismissButton = page.getByRole("button", {name: "Dismiss"})
    await expect.element(dismissButton).toBeDisabled()

    await dismissButton.click({force: true}).catch(() => {
      // disabled buttons reject pointer events; swallow so the assertion runs
    })

    expect(onDismiss).not.toHaveBeenCalled()
  })
})
