// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=17809-2448
// component=Avatar

const figma = require("figma")

const instance = figma.selectedInstance

const layers = {
  icon: "Avatar icon options",
  image: "Avatar image options",
  initial: "Avatar initial options",
}
const variant = instance.getEnum("variant", {
  icon: "icon",
  image: "image",
  initial: "initial",
})

const child = instance.findInstance(layers[variant] || layers.icon)

const size = child.getEnum("size", {lg: "lg", sm: "sm", xl: "xl", xs: "xs"})
const status = child.getBoolean("status")

const emphasis =
  variant !== "image"
    ? child.getEnum("emphasis", {brand: "brand", "high-contrast": "contrast"})
    : undefined

const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const statusAttr = status ? ` status="active"` : ""
const statusEl = status ? `  <div q-avatar-status></div>` : ""

let content
if (variant === "icon") {
  content = `
  <div q-avatar-content>
    <svg aria-label="User" qIcon="User"></svg>
  </div>`
} else if (variant === "initial") {
  const initialText = child.getString("initialText")
  content = `
  <div q-avatar-content>${initialText}</div>`
} else {
  content = `
  <img alt="User avatar" q-avatar-image src="path/to/image.jpg" />
  <!-- fallback -->
  <div q-avatar-content>O</div>`
}

export default {
  example: figma.code`<div q-avatar${emphasisAttr}${sizeAttr}${statusAttr}>${content}
  ${statusEl}
</div>`,
  id: "Avatar",
  imports: [
    `import { AvatarModule } from "@qualcomm-ui/angular/avatar"`,
    ...(variant === "icon"
      ? [`import { IconDirective } from "@qualcomm-ui/angular/icon"`]
      : []),
  ],
  metadata: {nestable: true},
}
