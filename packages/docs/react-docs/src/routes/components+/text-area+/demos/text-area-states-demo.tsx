import type {ReactElement} from "react"

import {TextArea} from "@qualcomm-ui/react/text-area"

export function TextAreaStatesDemo(): ReactElement {
  return (
    <div className="flex w-72 flex-col gap-4">
      {/* preview */}
      <TextArea disabled label="Disabled" placeholder="Disabled" />
      <TextArea label="Read only" placeholder="Read only" readOnly />
      <TextArea label="Required" placeholder="Required" required />
      <TextArea
        errorText="Invalid"
        invalid
        label="Invalid"
        placeholder="Invalid"
      />
      {/* preview */}
    </div>
  )
}
