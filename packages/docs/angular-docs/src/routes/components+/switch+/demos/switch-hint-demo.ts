import {Component} from "@angular/core"

import {SwitchModule} from "@qualcomm-ui/angular/switch"

@Component({
  imports: [SwitchModule],
  selector: "switch-hint-demo",
  template: `
    <!-- preview -->
    <label
      hint="You can change this later"
      label="Enable notifications"
      q-switch
    ></label>
    <!-- preview -->
  `,
})
export class SwitchHintDemo {}
