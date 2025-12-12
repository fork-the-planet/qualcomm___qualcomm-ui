import type {ReactElement} from "react"

import {TextArea} from "@qualcomm-ui/react/text-area"

export function TextAreaCompositeDemo(): ReactElement {
  return (
    // preview
    <TextArea.Root className="w-72" maxLength={50}>
      <TextArea.Label>Label</TextArea.Label>
      <TextArea.Counter />
      <TextArea.Input placeholder="Placeholder text" />
      <TextArea.Hint>Optional hint</TextArea.Hint>
      <TextArea.ErrorText>Optional error text</TextArea.ErrorText>
    </TextArea.Root>
    // preview
  )
}
