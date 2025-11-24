import {Component} from "@angular/core"

import {CellComponentContextDirective} from "@qualcomm-ui/angular/table"

import type {User} from "./data"

@Component({
  selector: "app-username-cell",
  template: `
    <div
      class="inline-flex h-full items-center gap-2"
      [style]="{
        paddingLeft: context().row.depth * 2 + 'rem',
      }"
    ></div>
  `,
})
export class UsernameCell extends CellComponentContextDirective<User> {}
