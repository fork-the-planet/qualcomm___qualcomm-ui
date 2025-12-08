import type {ReactElement} from "react"

import {Sigma} from "lucide-react"

import {NumberInput} from "@qualcomm-ui/react/number-input"

export function NumberInputSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col items-start gap-4">
      {/* preview */}
      <NumberInput
        aria-label="sm demo"
        className="w-56"
        placeholder="sm"
        size="sm"
        startIcon={Sigma}
      />
      <NumberInput
        aria-label="md demo"
        className="w-64"
        placeholder="md"
        startIcon={Sigma}
      />
      <NumberInput
        aria-label="lg demo"
        className="w-72"
        placeholder="lg"
        size="lg"
        startIcon={Sigma}
      />
      {/* preview */}
    </div>
  )
}
