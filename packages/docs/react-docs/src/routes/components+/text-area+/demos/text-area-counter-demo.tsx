import type {ReactElement} from "react"

import {TextArea} from "@qualcomm-ui/react/text-area"

export function TextAreaCounterDemo(): ReactElement {
  return (
    <div className="flex flex-col items-start gap-4">
      {/* preview */}
      <TextArea className="w-72" counter label="Counter without maxLength" />
      <TextArea
        className="w-72"
        label="Counter with maxLength"
        maxLength={10}
      />
      <TextArea
        className="w-72"
        counterProps={{
          display: (count, max) =>
            max ? `${count} of ${max} characters` : `${count} characters`,
        }}
        label="Custom counter display"
        maxLength={10}
      />
      {/* preview */}
    </div>
  )
}
