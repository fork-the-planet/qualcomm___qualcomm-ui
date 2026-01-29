import type {ReactElement} from "react"

import {AArrowDown} from "lucide-react"

import {TextInput} from "@qualcomm-ui/react/text-input"

export function TextInputCompositeDemo(): ReactElement {
  return (
    // preview
    <TextInput.Root className="w-72" startIcon={AArrowDown}>
      <TextInput.Label>Label</TextInput.Label>
      <TextInput.InputGroup>
        <TextInput.Input placeholder="Placeholder text" />
        <TextInput.ErrorIndicator />
      </TextInput.InputGroup>
      <TextInput.Hint>Optional hint</TextInput.Hint>
    </TextInput.Root>
    // preview
  )
}
