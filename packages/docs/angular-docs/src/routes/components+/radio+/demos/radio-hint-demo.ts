import {Component} from "@angular/core"

import {RadioModule} from "@qualcomm-ui/angular/radio"

@Component({
  imports: [RadioModule],
  selector: "radio-hint-demo",
  template: `
    <form>
      <!-- preview -->
      <fieldset defaultValue="weekly" name="frequency" q-radio-group>
        <div q-radio-group-label>Email frequency</div>
        <div q-radio-group-items>
          <label label="Daily" q-radio value="daily"></label>
          <label label="Weekly" q-radio value="weekly"></label>
          <label label="Monthly" q-radio value="monthly"></label>
        </div>
        <div q-radio-group-hint>You can change this in settings later</div>
      </fieldset>
      <!-- preview -->
    </form>
  `,
})
export class RadioHintDemo {}
