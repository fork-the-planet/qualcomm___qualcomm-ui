// Custom cell component for displaying account status as a colored badge
import {Component} from "@angular/core"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"
import {CellComponentContextDirective} from "@qualcomm-ui/angular/table"

import type {User} from "./data"

@Component({
  imports: [BadgeDirective],
  selector: "app-status-cell",
  template: `
    <div q-badge [emphasis]="statusEmphasis()">
      {{ context().getValue() }}
    </div>
  `,
})
export class StatusCell extends CellComponentContextDirective<User, string> {
  statusEmphasis() {
    const value = this.context().getValue()
    switch (value) {
      case "active":
        return "success"
      case "suspended":
        return "danger"
      case "pending":
        return "warning"
      default:
        return "neutral"
    }
  }
}
