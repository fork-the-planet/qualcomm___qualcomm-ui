import {Component} from "@angular/core"

import {TextAreaModule} from "@qualcomm-ui/angular/text-area"

@Component({
  imports: [TextAreaModule],
  selector: "text-area-sizes-demo",
  template: `
    <div class="flex flex-col items-start gap-4">
      <!-- preview -->
      <q-text-area class="w-56" defaultValue="sm" size="sm" />
      <q-text-area class="w-60" defaultValue="md" />
      <q-text-area class="w-64" defaultValue="lg" size="lg" />
      <!-- preview -->
    </div>
  `,
})
export class TextAreaSizesDemo {}
