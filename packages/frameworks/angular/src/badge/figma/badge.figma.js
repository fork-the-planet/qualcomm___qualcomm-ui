// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=17812-2960
// component=Badge

const figma = require("figma")

const instance = figma.selectedInstance

const variant = instance.getEnum("variant", {
  count: "count",
  icon: "icon",
  status: "status",
  text: "text",
})

const layers = {
  count: "Badge count options",
  icon: "Badge icon options",
  status: "Badge status options",
  text: "Badge text options",
}
const child = instance.findInstance(layers[variant] || layers.count)

const disabled = child.getEnum("disabled", {yes: true})
const disabledAttr = disabled ? " disabled" : ""

let example

// number badge
if (variant === "count") {
  const emphasis = child.getEnum("emphasis", {
    brand: "brand",
    "brand-outline": "brand-outline",
    danger: "danger",
    info: "info",
    "neutral-outline": "neutral-outline",
    "persistent-black": "persistent-black",
    "persistent-white": "persistent-white",
    success: "success",
    warning: "warning",
  })
  const size = child.getEnum("size", {lg: "lg", sm: "sm"})
  const label = child.getString("label") || "5"

  const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
  const sizeAttr = size ? ` size="${size}"` : ""

  example = figma.code`<span${disabledAttr}${emphasisAttr} q-number-badge${sizeAttr} [value]="${label}"></span>`
}

// status badge
if (variant === "status") {
  const variantVal = child.getEnum("variant", {outline: "outlined"})
  const emphasis = child.getEnum("emphasis", {
    brand: "brand",
    danger: "danger",
    info: "info",
    success: "success",
    warning: "warning",
  })
  const size = child.getEnum("size", {lg: "lg", sm: "sm", xl: "xl", xs: "xs"})

  const variantAttr = variantVal ? ` variant="${variantVal}"` : ""
  const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
  const sizeAttr = size ? ` size="${size}"` : ""

  example = figma.code`<span${disabledAttr}${emphasisAttr} q-status-badge${sizeAttr}${variantAttr}></span>`
}

// icon badge
if (variant === "icon") {
  const variantVal = child.getEnum("variant", {subtle: "subtle"})
  const emphasis = child.getEnum("emphasis", {
    blue: "blue",
    brand: "brand",
    cyan: "cyan",
    danger: "danger",
    green: "green",
    info: "info",
    kiwi: "kiwi",
    magenta: "magenta",
    orange: "orange",
    purple: "purple",
    red: "red",
    success: "success",
    teal: "teal",
    warning: "warning",
    yellow: "yellow",
  })
  const size = child.getEnum("size", {
    lg: "lg",
    sm: "sm",
    xl: "xl",
    xs: "xs",
    xxs: "xxs",
  })

  const variantAttr = variantVal ? ` variant="${variantVal}"` : ""
  const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
  const sizeAttr = size ? ` size="${size}"` : ""

  example = figma.code`<span${disabledAttr}${emphasisAttr} icon="Star" q-icon-badge${sizeAttr}${variantAttr}></span>`
}

// text badge
if (variant === "text") {
  const variantVal = child.getEnum("variant", {subtle: "subtle"})
  const emphasis = child.getEnum("emphasis", {
    blue: "blue",
    brand: "brand",
    cyan: "cyan",
    danger: "danger",
    green: "green",
    info: "info",
    kiwi: "kiwi",
    magenta: "magenta",
    orange: "orange",
    purple: "purple",
    red: "red",
    success: "success",
    teal: "teal",
    warning: "warning",
    yellow: "yellow",
  })
  const size = child.getEnum("size", {lg: "lg", sm: "sm"})
  const label = child.getString("label") || "badge"

  const variantAttr = variantVal ? ` variant="${variantVal}"` : ""
  const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
  const sizeAttr = size ? ` size="${size}"` : ""

  example = figma.code`<span${disabledAttr}${emphasisAttr} q-badge${sizeAttr}${variantAttr}>${label}</span>`
}

export default {
  example,
  id: "Badge",
  imports: [
    `import {BadgeModule} from "@qualcomm-ui/angular/badge"`,
    ...(variant === "icon" ? [`import {Star} from "lucide-angular"`] : []),
  ],
  metadata: {nestable: true},
}
