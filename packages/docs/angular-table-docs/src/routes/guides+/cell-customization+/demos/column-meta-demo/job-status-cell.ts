import {Component, computed} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {CellComponentContextDirective} from "@qualcomm-ui/angular/table"
import {selectCollection} from "@qualcomm-ui/core/select"

import type {Job, JobStatus, JobStatusColumnMeta} from "./data"

@Component({
  imports: [SelectModule, FormsModule],
  selector: "app-job-status-cell",
  template: `
    <q-select
      aria-label="Job Status"
      class="w-56"
      placeholder="Select action"
      size="sm"
      [collection]="collection"
      [ngModel]="value()"
      (ngModelChange)="onChange($event)"
    />
  `,
})
export class JobStatusCell extends CellComponentContextDirective<
  Job,
  JobStatus | undefined,
  JobStatusColumnMeta
> {
  readonly value = computed(() => {
    const status = this.context().getValue()
    return status ? [status] : []
  })

  readonly collection = selectCollection<JobStatus>({
    items: ["Approve", "Request Information", "Deny"],
  })

  onChange(value: JobStatus[]) {
    this.context().column.columnDef.meta?.onStatusUpdate(
      this.context().row.index,
      value[0],
    )
  }
}
