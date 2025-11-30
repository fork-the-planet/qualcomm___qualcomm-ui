import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {PopoverModule} from "@qualcomm-ui/angular/popover"

@Component({
  imports: [PopoverModule, ButtonModule],
  selector: "popover-simple-demo",
  template: `
    <!-- preview -->
    <div description="Description" label="Label" q-popover>
      <div q-popover-anchor>
        <button q-button q-popover-trigger variant="outline">Click Me</button>
      </div>
    </div>
    <!-- preview -->
  `,
})
export class PopoverSimpleDemo {}
