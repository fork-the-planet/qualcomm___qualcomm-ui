// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=3728-17610
// component=Breadcrumb

const figma = require("figma")

const instance = figma.selectedInstance

const emphasis = instance.getEnum("emphasis", {neutral: "neutral"})
const size = instance.getEnum("size", {lg: "lg", sm: "sm"})
const icons = instance.getBoolean("icons")

const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""

const items = instance
  .findConnectedInstances(
    (node) => {
      const s = node.getEnum("state", {
        active: "a",
        disabled: "d",
        focus: "f",
        hover: "h",
        idle: "i",
        pressed: "p",
      })
      return typeof s === "string"
    },
    {traverseInstances: true},
  )
  .reverse() // findConnectedInstances seems to return items in reverse visual order?

const children = items
  .map((item) => {
    const state = item.getEnum("state", {
      active: "active",
      disabled: "disabled",
    })

    const disabledAttr = state === "disabled" ? " disabled" : ""
    const ariaCurrentAttr = state === "active" ? ` aria-current="page"` : ""
    const iconEl = icons
      ? `<svg q-breadcrumb-item-icon qIcon="FolderClosed"></svg>`
      : ""

    return `
    <li${disabledAttr} q-breadcrumb-item>
      <a${ariaCurrentAttr} q-breadcrumb-item-trigger>
        ${iconEl}
        Breadcrumb
      </a>
    </li>`
  })
  .join("\n")

export default {
  example: figma.code`
    <nav aria-label="Breadcrumbs"${emphasisAttr} q-breadcrumbs-root${sizeAttr}>
      <ol q-breadcrumbs-list>
        ${children}
      </ol>
    </nav>`,
  id: "Breadcrumbs",
  imports: [
    `import {BreadcrumbsModule} from "@qualcomm-ui/angular/breadcrumbs"`,
    ...(icons
      ? [
          `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
          `import {FolderClosed} from "lucide-angular"`,
        ]
      : []),
  ],
  metadata: {nestable: true},
}
