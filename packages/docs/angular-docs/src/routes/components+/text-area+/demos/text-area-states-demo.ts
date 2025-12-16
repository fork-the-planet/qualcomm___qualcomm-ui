import {Component} from "@angular/core"

import {TextAreaModule} from "@qualcomm-ui/angular/text-area"

@Component({
  imports: [TextAreaModule],
  selector: "text-area-states-demo",
  template: `
    <div class="flex w-72 flex-col gap-4">
      <!-- preview -->
      <q-text-area disabled label="Disabled" placeholder="Disabled" />
      <q-text-area label="Read only" placeholder="Read only" readOnly />
      <q-text-area
        errorText="Invalid"
        invalid
        label="Invalid"
        placeholder="Invalid"
      />
      <!-- preview -->
    </div>
  `,
})
export class TextAreaStatesDemo {}
