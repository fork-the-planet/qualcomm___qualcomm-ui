import {Component} from "@angular/core"

import {TextAreaModule} from "@qualcomm-ui/angular/text-area"

@Component({
  imports: [TextAreaModule],
  selector: "text-area-composite-demo",
  template: `
    <!-- preview -->
    <div class="w-72" q-text-area-root>
      <label q-text-area-label>Label</label>
      <div q-text-area-counter></div>
      <textarea placeholder="Placeholder text" q-text-area-input></textarea>
      <div q-text-area-hint>Optional hint</div>
      <div q-text-area-error-text>Optional error text</div>
    </div>
    <!-- preview -->
  `,
})
export class TextAreaCompositeDemo {}
