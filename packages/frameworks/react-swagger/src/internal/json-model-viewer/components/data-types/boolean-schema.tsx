import {defineEasyType} from "./define-easy-type"

export const booleanSchemaType = defineEasyType<string>({
  Renderer: () => {
    return <span className="data-value">boolean</span>
  },
  colorKey: "base09",
  is: (value: unknown) =>
    !!(
      value &&
      typeof value === "object" &&
      "type" in value &&
      value.type === "boolean"
    ),
  type: "boolean",
})
