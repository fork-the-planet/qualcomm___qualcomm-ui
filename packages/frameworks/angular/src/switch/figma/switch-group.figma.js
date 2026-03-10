// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=2342-1717
// component=Switch group

const figma = require("figma")

const instance = figma.selectedInstance

const indented = instance.getBoolean("indented")
const invalid = instance.getBoolean("destructive")
const label = instance.getString("label")
const orientation = instance.getEnum("orientation", {
  horizontal: "horizontal",
})
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
})
const switch3 = instance.getBoolean("switch3")
const switch4 = instance.getBoolean("switch4")
const switch5 = instance.getBoolean("switch5")
const switch6 = instance.getBoolean("switch6")

const errorTextAttr = invalid ? '\n  errorText="Error message"' : ""
const indentedAttr = indented ? "\n  indented" : ""
const invalidAttr = invalid ? "\n  invalid" : ""
const labelAttr = label ? `\n  label="${label}"` : ""
const orientationAttr = orientation ? `\n  orientation="${orientation}"` : ""
const sizeAttr = size ? `\n  size="${size}"` : ""

const childInvalidAttr = invalid ? " invalid" : ""
const sw3 = switch3
  ? `\n  <label${childInvalidAttr} label="Switch value" q-switch></label>`
  : ""
const sw4 = switch4
  ? `\n  <label${childInvalidAttr} label="Switch value" q-switch></label>`
  : ""
const sw5 = switch5
  ? `\n  <label${childInvalidAttr} label="Switch value" q-switch></label>`
  : ""
const sw6 = switch6
  ? `\n  <label${childInvalidAttr} label="Switch value" q-switch></label>`
  : ""

export default {
  example: figma.code`<fieldset${errorTextAttr}${indentedAttr}${invalidAttr}${labelAttr}${orientationAttr}
  q-switch-group${sizeAttr}
>
  <label defaultChecked${childInvalidAttr} label="Switch value" q-switch></label>
  <label${childInvalidAttr} label="Switch value" q-switch></label>${sw3}${sw4}${sw5}${sw6}
</fieldset>`,
  id: "SwitchGroup",
  imports: [
    'import { SwitchGroupModule } from "@qualcomm-ui/angular/switch-group"',
    'import { SwitchModule } from "@qualcomm-ui/angular/switch"',
  ],
  metadata: {nestable: true},
}
