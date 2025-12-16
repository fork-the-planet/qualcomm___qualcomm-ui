import type {ReactElement} from "react"

import {TextArea} from "@qualcomm-ui/react/text-area"

export function TextAreaSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col items-start gap-4">
      {/* preview */}
      <TextArea className="w-56" defaultValue="sm" size="sm" />
      <TextArea className="w-60" defaultValue="md" />
      <TextArea className="w-64" defaultValue="lg" size="lg" />
      {/* preview */}
    </div>
  )
}
