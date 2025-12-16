import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {TextAreaModule} from "@qualcomm-ui/angular/text-area"

@Component({
  imports: [TextAreaModule, FormsModule],
  selector: "text-area-required-template-forms-demo",
  template: `
    <!-- preview -->
    <q-text-area
      class="w-72"
      label="Required"
      placeholder="Enter text"
      required
      [(ngModel)]="value"
    />
    <!-- preview -->
  `,
})
export class TextAreaRequiredTemplateFormsDemo {
  readonly value = signal("")
}
