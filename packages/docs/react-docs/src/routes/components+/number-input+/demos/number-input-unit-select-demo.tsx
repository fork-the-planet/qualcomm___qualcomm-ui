import type {ReactElement} from "react"

import {NumberInput} from "@qualcomm-ui/react/number-input"

const currencyOptions = [
  {displayText: "$ (USD)", label: "$", value: "USD"},
  {displayText: "£ (GBP)", label: "£", value: "GBP"},
  {displayText: "€ (EUR)", label: "€", value: "EUR"},
]

export function NumberInputUnitSelectDemo(): ReactElement {
  return (
    // preview
    <NumberInput
      className="w-72"
      defaultUnit="USD"
      label="idle"
      placeholder="0.00"
      unitOptions={currencyOptions}
      value="0"
    />
    // preview
  )
}
