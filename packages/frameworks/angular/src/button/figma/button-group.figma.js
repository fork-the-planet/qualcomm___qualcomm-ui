// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=7191-1090
// component=Button group

const figma = require("figma")

const instance = figma.selectedInstance

const layout = instance.getEnum("buttonWidth", {fill: "fill"})
const size = instance.getEnum("size", {lg: "lg", sm: "sm"})

const layoutAttr = layout ? ` layout="${layout}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""

const buttons = instance.findConnectedInstances(
  (node) => typeof node.getString("label") === "string",
  {traverseInstances: true},
)

let hasIcon = false

const children = buttons
  .map((btn) => {
    const btnDisabled = btn.getEnum("state", {disabled: true})
    const btnEmphasis = btn.getEnum("emphasis", {
      "black-persistent": "black-persistent",
      danger: "danger",
      primary: "primary",
      "white-persistent": "white-persistent",
    })
    const btnIcon = btn.getEnum("icon", {
      end: "end",
      only: "only",
      start: "start",
    })
    const btnLabel = btn.getString("label") || "Button"
    const btnVariant = btn.getEnum("variant", {
      ghost: "ghost",
      outline: "outline",
    })

    if (btnIcon) {
      hasIcon = true
    }

    const dAttr = btnDisabled ? " disabled" : ""
    const eAttr = btnEmphasis ? ` emphasis="${btnEmphasis}"` : ""
    const vAttr = btnVariant ? ` variant="${btnVariant}"` : ""

    // icon-only child button
    if (btnIcon === "only") {
      return `<button${dAttr}${eAttr} icon="Star" q-icon-button${vAttr}></button>`
    }

    // child button with start icon
    if (btnIcon === "start") {
      return `
      <button${dAttr}${eAttr} q-button${vAttr}>
        <svg q-start-icon qIcon="Star"></svg>
        ${btnLabel}
      </button>`
    }

    // child button with end icon
    if (btnIcon === "end") {
      return `
      <button${dAttr}${eAttr} q-button${vAttr}>
        ${btnLabel}
        <svg q-end-icon qIcon="Star"></svg>
      </button>`
    }

    // child button without icon
    return `<button${dAttr}${eAttr} q-button${vAttr}>${btnLabel}</button>`
  })
  .join("\n")

export default {
  example: figma.code`
    <div${layoutAttr} q-button-group${sizeAttr}>
      ${children}
    </div>`,
  id: "ButtonGroup",
  imports: [
    `import {ButtonModule} from "@qualcomm-ui/angular/button"`,
    ...(hasIcon
      ? [
          `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
          `import {Star} from "lucide-angular"`,
        ]
      : []),
  ],
  metadata: {nestable: true},
}
