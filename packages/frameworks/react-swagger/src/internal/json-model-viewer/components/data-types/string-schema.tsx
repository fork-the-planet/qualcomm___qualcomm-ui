import {defineEasyType} from "./define-easy-type"

export const stringSchemaType = defineEasyType<string>({
  Renderer: () => {
    return <span className="data-value">string</span>
  },
  colorKey: "base09",
  is: (value: unknown) =>
    !!(
      value &&
      typeof value === "object" &&
      "type" in value &&
      value.type === "string"
    ),
  type: "string",
})
