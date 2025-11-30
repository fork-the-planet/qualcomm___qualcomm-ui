// Custom cell component for formatting session duration
import {Component} from "@angular/core"

import {CellComponentContextDirective} from "@qualcomm-ui/angular/table"

import type {User} from "./data"

@Component({
  selector: "app-duration-cell-2",
  template: `
    {{ formattedDuration() }}
  `,
})
export class DurationCell extends CellComponentContextDirective<User, number> {
  formattedDuration() {
    const minutes = this.context().getValue()
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }
}
