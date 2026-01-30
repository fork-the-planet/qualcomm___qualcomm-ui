import {Component} from "@angular/core"

import {
  NumberInputModule,
  type UnitOption,
} from "@qualcomm-ui/angular/number-input"

@Component({
  imports: [NumberInputModule],
  selector: "number-input-unit-select-demo",
  template: `
    <!-- preview -->
    <q-number-input
      class="w-72"
      defaultUnit="USD"
      label="Price"
      placeholder="0.00"
      [unitOptions]="unitOptions"
    />
    <!-- preview -->
  `,
})
export class NumberInputUnitSelectDemo {
  unitOptions: UnitOption[] = [
    {displayText: "$ (USD)", label: "$", value: "USD"},
    {displayText: "£ (GBP)", label: "£", value: "GBP"},
    {displayText: "€ (EUR)", label: "€", value: "EUR"},
  ]
}
