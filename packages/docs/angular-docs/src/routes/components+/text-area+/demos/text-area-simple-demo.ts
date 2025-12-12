import {Component} from "@angular/core"

import {TextAreaModule} from "@qualcomm-ui/angular/text-area"

@Component({
  imports: [TextAreaModule],
  selector: "text-area-simple-demo",
  template: `
    <!-- preview -->
    <q-text-area
      class="w-72"
      hint="Optional hint"
      label="Label"
      placeholder="Placeholder text"
    />
    <!-- preview -->
  `,
})
export class TextAreaSimpleDemo {}
