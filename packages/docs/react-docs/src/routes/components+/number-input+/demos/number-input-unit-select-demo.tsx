import type {ReactElement} from "react"

import {NumberInput, type UnitOption} from "@qualcomm-ui/react/number-input"

const currencyOptions: UnitOption[] = [
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
      label="Price"
      placeholder="0.00"
      unitOptions={currencyOptions}
      value="0"
    />
    // preview
  )
}
