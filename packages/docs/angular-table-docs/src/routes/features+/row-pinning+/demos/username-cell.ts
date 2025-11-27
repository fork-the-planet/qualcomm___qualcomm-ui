import {Component} from "@angular/core"

import {
  CellComponentContextDirective,
  TableModule,
} from "@qualcomm-ui/angular/table"

import type {User} from "./data"

@Component({
  imports: [TableModule],
  selector: "app-username-cell",
  template: `
    <div
      class="inline-flex h-full items-center gap-2"
      [style]="{
        paddingLeft: context().row.depth * 2 + 'rem',
      }"
    >
      @if (context().row.getCanExpand()) {
        <button
          q-table-row-expand-button
          [isExpanded]="context().row.getIsExpanded()"
          [row]="context().row"
        ></button>
      }
      <span>{{ context().getValue() }}</span>
    </div>
  `,
})
export class UsernameCell extends CellComponentContextDirective<User> {}
