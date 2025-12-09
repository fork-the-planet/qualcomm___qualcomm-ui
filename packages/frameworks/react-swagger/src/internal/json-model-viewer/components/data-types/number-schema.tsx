import {defineEasyType} from "./define-easy-type"

export const numberSchemaType = defineEasyType<string>({
  Renderer: () => {
    return <span className="data-value">integer</span>
  },
  colorKey: "base09",
  is: (value: unknown) =>
    !!(
      value &&
      typeof value === "object" &&
      "type" in value &&
      value.type === "integer"
    ),
  type: "integer",
})
