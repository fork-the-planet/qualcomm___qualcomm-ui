import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {TextAreaModule} from "@qualcomm-ui/angular/text-area"

@Component({
  imports: [TextAreaModule, FormsModule],
  selector: "text-area-template-forms-demo",
  template: `
    <!-- preview -->
    <q-text-area
      #textArea
      class="w-72"
      errorText="You must enter at least 10 characters."
      hint="10 characters minimum"
      label="Feedback"
      placeholder="Enter your feedback"
      required
      [invalid]="value().length < 10"
      [(ngModel)]="value"
    />
    <!-- preview -->
  `,
})
export class TextAreaTemplateFormsDemo {
  readonly value = signal<string>("Make me shorter")
}
