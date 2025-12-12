import {Component, computed, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {TextAreaModule} from "@qualcomm-ui/angular/text-area"

@Component({
  imports: [TextAreaModule, FormsModule],
  selector: "text-area-composite-forms-demo",
  template: `
    <!-- preview -->
    <div
      class="w-72"
      q-text-area-root
      [invalid]="isInvalid()"
      [(ngModel)]="value"
    >
      <label q-text-area-label>Composite Forms</label>
      <div q-text-area-counter></div>
      <textarea placeholder="Enter text" q-text-area-input></textarea>
      <div q-text-area-error-text>Must be at least 30 characters long</div>
    </div>
    <!-- preview -->
  `,
})
export class TextAreaCompositeFormsDemo {
  readonly value = signal("Shorten me to see the validation error")

  readonly isInvalid = computed(() => this.value().length < 30)
}
