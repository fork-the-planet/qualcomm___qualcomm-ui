import {Component} from "@angular/core"

import {TextAreaModule} from "@qualcomm-ui/angular/text-area"

@Component({
  imports: [TextAreaModule],
  selector: "text-area-counter-demo",
  template: `
    <div class="flex flex-col items-start gap-4">
      <!-- preview -->
      <q-text-area class="w-72" counter label="Counter without maxLength" />
      <q-text-area
        class="w-72"
        label="Counter with maxLength"
        [maxLength]="10"
      />
      <q-text-area class="w-72" label="Custom counter display" [maxLength]="10">
        <div q-text-area-counter [display]="customDisplay"></div>
      </q-text-area>
      <!-- preview -->
    </div>
  `,
})
export class TextAreaCounterDemo {
  customDisplay = (count: number, max?: number) =>
    max ? `${count} of ${max} characters` : `${count} characters`
}
