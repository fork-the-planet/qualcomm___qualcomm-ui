import {Component, type OnInit, signal, viewChild} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {
  type TextAreaComponent,
  TextAreaModule,
} from "@qualcomm-ui/angular/text-area"

@Component({
  imports: [TextAreaModule, FormsModule],
  selector: "text-area-error-text-demo",
  template: `
    <!-- preview -->
    <q-text-area
      #textArea
      class="w-72"
      errorText="You must enter at least 10 characters."
      label="Label"
      placeholder="Enter at least 10 characters"
      required
      [invalid]="value().length < 10"
      [(ngModel)]="value"
    />
    <!-- preview -->
  `,
})
export class TextAreaErrorTextDemo implements OnInit {
  readonly value = signal<string>("")

  readonly textArea = viewChild.required<TextAreaComponent>("textArea")

  ngOnInit() {
    this.textArea().control?.markAsDirty()
  }
}
