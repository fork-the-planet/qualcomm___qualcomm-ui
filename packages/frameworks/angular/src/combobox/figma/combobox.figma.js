// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=13121-11284
// component=Combobox

const figma = require("figma")

const instance = figma.selectedInstance

const label = instance.getBoolean("label", {
  true: instance.getString("labelText"),
})
const hint = instance.getBoolean("hint", {
  true: instance.getString("hintText"),
})
const disabled = instance.getEnum("state", {
  disabled: true,
})
const invalid = instance.getEnum("state", {
  invalid: true,
  "invalid-focus": true,
  "invalid-open": true,
})
const readOnly = instance.getEnum("state", {
  "read-only": true,
})
const required = instance.getBoolean("required")
const startIcon = instance.getBoolean("startIcon")
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
})

const disabledAttr = disabled ? "\n  disabled" : ""
const errorTextAttr = invalid ? `\n  errorText="Error message"` : ""
const hintAttr = hint ? `\n  hint="${hint}"` : ""
const iconAttr = startIcon ? `\n  icon="Layers"` : ""
const invalidAttr = invalid ? "\n  invalid" : ""
const labelAttr = label
  ? `\n  label="${label}"`
  : `\n  aria-label="Select an option"`
const readOnlyAttr = readOnly ? "\n  readOnly" : ""
const requiredAttr = required ? "\n  required" : ""
const sizeAttr = size ? `\n  size="${size}"` : ""

const example = figma.code`<q-combobox
  [collection]="collection"${disabledAttr}${errorTextAttr}${hintAttr}${iconAttr}${invalidAttr}${labelAttr}
  placeholder="Select an option"${readOnlyAttr}${requiredAttr}${sizeAttr}>
</q-combobox>`

export default {
  example,
  id: "Combobox",
  imports: [`import { ComboboxModule } from "@qualcomm-ui/angular/combobox"`],
  metadata: {nestable: true},
}
