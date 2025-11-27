import {Component, signal} from "@angular/core"

import {
  type AngularTable,
  createAngularTable,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {type ColumnDef, getCoreRowModel} from "@qualcomm-ui/core/table"

import {type Job, jobs, type JobStatus, type JobStatusColumnMeta} from "./data"
import {JobStatusCell} from "./job-status-cell"

@Component({
  imports: [TableModule],
  selector: "column-meta-demo",
  template: `
    <div q-table-root>
      <div q-table-scroll-container>
        <table q-table-table>
          <thead q-table-header>
            @for (
              headerGroup of table.getHeaderGroups();
              track headerGroup.id
            ) {
              <tr q-table-row>
                @for (header of headerGroup.headers; track header.id) {
                  <th q-table-header-cell [style.width.px]="header.getSize()">
                    <ng-container *renderHeader="header; let value">
                      {{ value }}
                    </ng-container>
                  </th>
                }
              </tr>
            }
          </thead>
          <tbody q-table-body>
            @for (row of table.getRowModel().rows; track row.id) {
              <tr q-table-row>
                @for (cell of row.getVisibleCells(); track cell.id) {
                  <td q-table-cell [style.width.px]="cell.column.getSize()">
                    <ng-container *renderCell="cell; let value">
                      {{ value }}
                    </ng-container>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ColumnMetaDemo {
  protected readonly data = signal<Job[]>(jobs)

  protected readonly columns: ColumnDef<Job, any>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "user",
      header: "User",
    },
    {
      accessorKey: "status",
      cell: () => JobStatusCell,
      header: "Action",
      meta: {
        onStatusUpdate: (rowIndex: number, status: JobStatus | undefined) => {
          this.data.update((prevData) =>
            prevData.map((job, index) =>
              index === rowIndex ? {...job, status} : job,
            ),
          )
        },
      } satisfies JobStatusColumnMeta,
    },
  ]

  protected readonly table: AngularTable<Job> = createAngularTable(() => ({
    columns: this.columns,
    data: this.data(),
    getCoreRowModel: getCoreRowModel(),
  }))
}
