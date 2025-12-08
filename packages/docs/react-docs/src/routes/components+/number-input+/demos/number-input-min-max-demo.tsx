import type {ReactElement} from "react"

import {NumberInput} from "@qualcomm-ui/react/number-input"

export function NumberInputMinMaxDemo(): ReactElement {
  return (
    // preview
    <NumberInput
      aria-label="input min-max demo"
      className="w-72"
      defaultValue="5"
      max={10}
      min={5}
    />
    // preview
  )
}
