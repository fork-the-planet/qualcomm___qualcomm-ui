import {type ReactElement, useState} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {TextArea} from "@qualcomm-ui/react/text-area"

export function TextAreaControlledStateDemo(): ReactElement {
  const [value, setValue] = useState<string>("Controlled value")

  return (
    <div className="flex items-end gap-4">
      <TextArea.Root
        className="w-72"
        onValueChange={(updatedValue) => {
          console.debug("Value changed:", updatedValue)
          setValue(updatedValue)
        }}
        value={value}
      >
        <TextArea.Label>Label</TextArea.Label>
        <TextArea.Input placeholder="Placeholder text" />
      </TextArea.Root>

      <Button emphasis="primary" onClick={() => setValue("")} variant="outline">
        Reset
      </Button>
    </div>
  )
}
