import type {ReactElement} from "react"

import {TextInput} from "@qualcomm-ui/react/text-input"

export function TextInputClearTriggerDemo(): ReactElement {
  return (
    <div className="flex w-48 flex-col gap-4">
      {/* preview */}
      <TextInput defaultValue="Simple" inputProps={{"aria-label": "Simple"}} />

      <TextInput.Root defaultValue="Composite">
        <TextInput.InputGroup>
          <TextInput.Input aria-label="Composite" />
          <TextInput.ClearTrigger />
        </TextInput.InputGroup>
      </TextInput.Root>
      {/* preview */}
    </div>
  )
}
