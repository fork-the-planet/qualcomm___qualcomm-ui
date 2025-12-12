import {Component} from "@angular/core"

import {TextAreaModule} from "@qualcomm-ui/angular/text-area"

@Component({
  imports: [TextAreaModule],
  selector: "text-area-value-changed-demo",
  template: `
    <q-text-area
      class="w-72"
      defaultValue="Initial value"
      label="Label"
      placeholder="Placeholder text"
      (valueChanged)="onValueChanged($event)"
    />
  `,
})
export class TextAreaValueChangedDemo {
  onValueChanged(newValue: string) {
    console.log("Value changed:", newValue)
  }
}
