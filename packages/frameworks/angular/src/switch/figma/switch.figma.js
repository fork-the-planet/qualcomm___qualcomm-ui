// url=<FIGMA_COMPONENTS_BASE>?node-id=12609-520
// component=Switch

const figma = require("figma")

const instance = figma.selectedInstance

const defaultChecked = instance.getEnum("variant", {
  checked: true,
  "invalid-checked": true,
})
const disabled = instance.getEnum("state", {
  disabled: true,
})
const invalid = instance.getEnum("variant", {
  "invalid-checked": true,
  "invalid-unchecked": true,
})
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
})

const checkedAttr = defaultChecked ? "\n  defaultChecked" : ""
const disabledAttr = disabled ? "\n  disabled" : ""
const invalidAttr = invalid ? "\n  invalid" : ""
const sizeAttr = size ? `\n  size="${size}"` : ""

export default {
  example: figma.code`<label q-switch${checkedAttr}${disabledAttr}${invalidAttr}${sizeAttr}></label>`,
  id: "Switch",
  imports: ['import { SwitchModule } from "@qualcomm-ui/angular/switch"'],
  metadata: {nestable: true},
}
