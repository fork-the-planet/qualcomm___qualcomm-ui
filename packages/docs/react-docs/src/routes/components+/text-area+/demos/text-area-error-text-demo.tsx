import {type ReactElement, useState} from "react"

import {TextArea} from "@qualcomm-ui/react/text-area"

export function TextAreaErrorTextDemo(): ReactElement {
  const [value, setValue] = useState<string>("")

  return (
    // preview
    <TextArea
      className="w-72"
      errorText="You must enter at least 10 characters."
      invalid={value.length < 10}
      label="Label"
      onValueChange={setValue}
      placeholder="Enter at least 10 characters"
      required
      value={value}
    />
    // preview
  )
}
