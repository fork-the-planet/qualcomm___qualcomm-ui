// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=17862-1908
// component=Dialog

const figma = require("figma")

const instance = figma.selectedInstance

const variant = instance.getEnum("variant", {
  default: "default",
  form: "form",
})

let example
let needsButtonModule = false

// default variant
if (variant === "default" || !variant) {
  const child = instance.findInstance("Dialog default options")

  const dismiss = child.getBoolean("dismiss")
  const heading = child.getBoolean("heading")
  const icon = child.getBoolean("icon")
  const size = child.getEnum("size", {md: "md"})
  const slot = child.getBoolean("slot")
  const buttonGroup = child.getBoolean("buttonGroup")
  const destructive = child.getBoolean("destructive")

  const sizeAttr = size ? ` size="${size}"` : ""
  const hideIndicatorIconAttr = !icon ? " hideIndicatorIcon" : ""

  const headingText = child.getString("headingText") || "Heading"
  const headingEl = heading ? `<h2 q-dialog-heading>${headingText}</h2>` : ""
  const dismissEl = dismiss ? `<button q-dialog-close-button></button>` : ""
  const slotEl = slot ? `<!-- Custom content -->` : ""

  const roleAttr = destructive ? ` role="alertdialog"` : ""
  const confirmEmphasis = destructive ? "danger" : "primary"
  const footerEl = buttonGroup
    ? `
      <div q-dialog-footer>
        <button emphasis="neutral" q-button q-dialog-close-trigger variant="outline">Cancel</button>
        <button emphasis="${confirmEmphasis}" q-button q-dialog-close-trigger>Confirm</button>
      </div>`
    : ""

  needsButtonModule = buttonGroup

  example = figma.code`
    <div defaultOpen q-dialog-root${roleAttr}${sizeAttr}>
      <q-dialog-floating-portal>
        <div${hideIndicatorIconAttr} q-dialog-body>
          ${dismissEl}
          ${headingEl}
          <p q-dialog-description>Lorem ipsum dolor sit amet.</p>
          ${slotEl}
        </div>
        ${footerEl}
      </q-dialog-floating-portal>
    </div>`
}

// form variant
if (variant === "form") {
  const child = instance.findInstance("Dialog form options")

  const dismiss = child.getBoolean("dismiss")
  const heading = child.getBoolean("heading")
  const icon = child.getBoolean("icon")
  const size = child.getEnum("size", {md: "md"})
  const buttonGroup = child.getBoolean("buttonGroup")

  const sizeAttr = size ? ` size="${size}"` : ""
  const hideIndicatorIconAttr = !icon ? " hideIndicatorIcon" : ""

  const headingText = child.getString("headingText") || "Heading"
  const headingEl = heading ? `<h2 q-dialog-heading>${headingText}</h2>` : ""
  const dismissEl = dismiss ? `<button q-dialog-close-button></button>` : ""

  const footerEl = buttonGroup
    ? `
      <div q-dialog-footer>
        <button emphasis="neutral" q-button q-dialog-close-trigger variant="outline">Cancel</button>
        <button emphasis="primary" q-button q-dialog-close-trigger>Confirm</button>
      </div>`
    : ""

  needsButtonModule = buttonGroup

  example = figma.code`
    <div defaultOpen q-dialog-root${sizeAttr}>
      <q-dialog-floating-portal>
        <div${hideIndicatorIconAttr} q-dialog-body>
          ${dismissEl}
          ${headingEl}
          <p q-dialog-description>Lorem ipsum dolor sit amet.</p>
          <!-- Form content -->
        </div>
        ${footerEl}
      </q-dialog-floating-portal>
    </div>`
}

export default {
  example,
  id: "Dialog",
  imports: [
    `import {DialogModule} from "@qualcomm-ui/angular/dialog"`,
    ...(needsButtonModule
      ? [`import {ButtonModule} from "@qualcomm-ui/angular/button"`]
      : []),
  ],
  metadata: {nestable: true},
}
