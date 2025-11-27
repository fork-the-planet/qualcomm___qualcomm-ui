import {Component} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"
import {HeaderComponentContextDirective} from "@qualcomm-ui/angular/table"

import type {User} from "./data"

@Component({
  imports: [CheckboxModule, FormsModule],
  selector: "app-row-selection-header",
  template: `
    <label
      q-checkbox
      size="sm"
      [indeterminate]="context().table.getIsSomeRowsSelected()"
      [ngModel]="context().table.getIsAllRowsSelected()"
      (ngModelChange)="context().table.toggleAllRowsSelected($event)"
    >
      <input aria-label="Toggle selection (all rows)" q-checkbox-hidden-input />
    </label>
  `,
})
export class RowSelectionHeader extends HeaderComponentContextDirective<User> {}
