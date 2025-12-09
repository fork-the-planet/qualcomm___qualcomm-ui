import {defineEasyType} from "./define-easy-type"

export const booleanType = defineEasyType<boolean>({
  Renderer: ({value}) => <>{value ? "true" : "false"}</>,
  colorKey: "base0E",
  deserialize: (value) => {
    if (value === "true") {
      return true
    }
    if (value === "false") {
      return false
    }
    throw new Error("Invalid boolean value")
  },
  is: (value) => typeof value === "boolean",
  serialize: (value) => value.toString(),
  type: "bool",
})
