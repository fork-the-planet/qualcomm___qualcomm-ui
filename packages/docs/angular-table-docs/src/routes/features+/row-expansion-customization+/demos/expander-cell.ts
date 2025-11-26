import {Component} from "@angular/core"

import {
  CellComponentContextDirective,
  TableModule,
} from "@qualcomm-ui/angular/table"

import type {User} from "./data"

@Component({
  imports: [TableModule],
  selector: "app-expander-cell",
  template: `
    @if (context().row.getCanExpand()) {
      <div class="inline-flex items-center justify-center">
        <button
          q-table-row-expand-button
          [isExpanded]="context().row.getIsExpanded()"
          [row]="context().row"
        ></button>
      </div>
    }
  `,
})
export class ExpanderCell extends CellComponentContextDirective<User> {}
