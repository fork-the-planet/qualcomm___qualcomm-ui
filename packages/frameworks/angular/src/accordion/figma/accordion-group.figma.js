// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=2191-5476
// component=Accordion group

const figma = require("figma")

const instance = figma.selectedInstance

const leftChevron = instance.getEnum("chevron", {left: "left"})
const icon = instance.getBoolean("icon")
const size = instance.getEnum("size", {lg: "lg", sm: "sm"})
const contained = instance.getBoolean("contained")

const sizeAttr = size ? ` size="${size}"` : ""
const uncontainedAttr = !contained ? " uncontained" : ""
const iconAttr = icon && !leftChevron ? ` icon="FileChartColumn"` : ""

const items = instance.findConnectedInstances(
  (node) => typeof node.getString("header") === "string",
  {traverseInstances: true},
)

const children = items
  .map((item, i) => {
    const header = item.getString("header") || "Title of accordion"
    const value = String.fromCharCode(97 + i)

    if (leftChevron) {
      return `  <div q-accordion-item-root value="${value}">
    <button q-accordion-item-trigger>
      <q-accordion-item-indicator />
      <span q-accordion-item-text>${header}</span>
    </button>
    <div q-accordion-item-content>Panel contents</div>
  </div>`
    }
    return `  <div${iconAttr} q-accordion-item text="${header}" value="${value}">Panel contents</div>`
  })
  .join("\n")

export default {
  example: figma.code`<div q-accordion${sizeAttr}${uncontainedAttr} [defaultValue]="['a']">
  ${children}
</div>`,
  id: "AccordionGroup",
  imports: [
    `import { AccordionModule } from "@qualcomm-ui/angular/accordion"`,
    ...(icon && !leftChevron
      ? [`import { IconDirective } from "@qualcomm-ui/angular/icon"`]
      : []),
  ],
  metadata: {nestable: true},
}
