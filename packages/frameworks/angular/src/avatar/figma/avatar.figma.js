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
const rendered = child.executeTemplate().example

export default {
  example: figma.code`${rendered}`,
  id: "Avatar",
  imports: [],
  metadata: {nestable: true},
}
