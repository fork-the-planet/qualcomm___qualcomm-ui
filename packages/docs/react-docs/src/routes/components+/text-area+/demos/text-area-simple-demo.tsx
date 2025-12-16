import type {ReactElement} from "react"

import {TextArea} from "@qualcomm-ui/react/text-area"

export function TextAreaSimpleDemo(): ReactElement {
  return (
    // preview
    <TextArea
      className="w-72"
      hint="Optional hint"
      label="Label"
      placeholder="Placeholder text"
    />
    // preview
  )
}
