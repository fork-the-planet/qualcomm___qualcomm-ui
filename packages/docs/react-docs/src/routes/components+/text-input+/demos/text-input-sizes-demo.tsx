import type {ReactElement} from "react"

import {Search} from "lucide-react"

import {TextInput} from "@qualcomm-ui/react/text-input"

export function TextInputSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col items-start gap-4">
      {/* preview */}
      <TextInput
        className="w-56"
        defaultValue="sm"
        inputProps={{
          "aria-label": "Search",
        }}
        size="sm"
        startIcon={Search}
      />
      <TextInput
        aria-label="Search"
        className="w-60"
        defaultValue="md"
        inputProps={{"aria-label": "Search"}}
        startIcon={Search}
      />
      <TextInput
        aria-label="Search"
        className="w-64"
        defaultValue="lg"
        inputProps={{"aria-label": "Search"}}
        size="lg"
        startIcon={Search}
      />
      {/* preview */}
    </div>
  )
}
