// url=<FIGMA_COMPONENTS_BASE>?node-id=2295-1239
// component=Checkbox group

const figma = require("figma")

const instance = figma.selectedInstance

const checkbox4 = instance.getBoolean("checkbox4")
const checkbox5 = instance.getBoolean("checkbox5")
const checkbox6 = instance.getBoolean("checkbox6")
const indented = instance.getBoolean("indented")
const invalid = instance.getBoolean("destructive")
const label = instance.getBoolean("label", {
  true: instance.getString("labelText"),
})
const orientation = instance.getEnum("orientation", {
  horizontal: "horizontal",
})
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
})

const errorTextAttr = invalid ? '\n  errorText="Error message"' : ""
const indentedAttr = indented ? "\n  indented" : ""
const invalidAttr = invalid ? "\n  invalid" : ""
const labelAttr = label ? `\n  label="${label}"` : ""
const orientationAttr = orientation ? `\n  orientation="${orientation}"` : ""
const sizeAttr = size ? `\n  size="${size}"` : ""

const childInvalidAttr = invalid ? " invalid" : ""
const cb4 = checkbox4
  ? `\n  <label${childInvalidAttr} label="Checkbox label" q-checkbox></label>`
  : ""
const cb5 = checkbox5
  ? `\n  <label${childInvalidAttr} label="Checkbox label" q-checkbox></label>`
  : ""
const cb6 = checkbox6
  ? `\n  <label${childInvalidAttr} label="Checkbox label" q-checkbox></label>`
  : ""

export default {
  example: figma.code`<fieldset${errorTextAttr}${indentedAttr}${invalidAttr}${labelAttr}${orientationAttr}
  q-checkbox-group${sizeAttr}
>
  <label defaultChecked${childInvalidAttr} label="Checkbox label" q-checkbox></label>
  <label${childInvalidAttr} label="Checkbox label" q-checkbox></label>
  <label${childInvalidAttr} label="Checkbox label" q-checkbox></label>${cb4}${cb5}${cb6}
</fieldset>`,
  id: "CheckboxGroup",
  imports: [
    'import { CheckboxGroupModule } from "@qualcomm-ui/angular/checkbox-group"',
    'import { CheckboxModule } from "@qualcomm-ui/angular/checkbox"',
  ],
  metadata: {nestable: true},
}
