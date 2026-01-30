import {Component} from "@angular/core"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"

@Component({
  imports: [CheckboxModule],
  selector: "checkbox-hint-demo",
  template: `
    <!-- preview -->
    <label
      hint="Keep me signed in for 30 days"
      label="Remember me"
      q-checkbox
    ></label>
    <!-- preview -->
  `,
})
export class CheckboxHintDemo {}
