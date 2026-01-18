import {Component} from "@angular/core"

import {SwitchModule} from "@qualcomm-ui/angular/switch"

@Component({
  imports: [SwitchModule],
  selector: "switch-sizes-demo",
  template: `
    <div class="flex flex-col items-start gap-4">
      <!-- preview -->
      <label label="Small (sm)" q-switch size="sm"></label>
      <label label="Medium (md)" q-switch size="md"></label>
      <label label="Large (lg)" q-switch size="lg"></label>
      <!-- preview -->
    </div>
  `,
})
export class SwitchSizesDemo {}
