import {Component} from "@angular/core"

import {CellComponentContextDirective} from "@qualcomm-ui/angular/table"

import type {User} from "./data"

@Component({
  selector: "app-username-cell",
  template: `
    <div [style.paddingLeft.rem]="context().row.depth * 2">
      {{ context().getValue() }}
    </div>
  `,
})
export class UsernameCell extends CellComponentContextDirective<User> {}
