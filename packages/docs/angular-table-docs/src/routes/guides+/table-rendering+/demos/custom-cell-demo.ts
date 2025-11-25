import {Component} from "@angular/core"

import {BadgeDirective} from "@qualcomm-ui/angular/badge"
import {
  CellComponentContextDirective,
  createAngularTable,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {type ColumnDef, getCoreRowModel} from "@qualcomm-ui/core/table"

import {type User, users} from "./data"

// Custom cell component for displaying account status as a colored badge
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

// Custom cell component for formatting session duration
@Component({
  selector: "app-duration-cell",
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

const columns: ColumnDef<User, any>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "accountStatus",
    cell: () => StatusCell,
    header: "Status",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "averageSessionDuration",
    cell: () => DurationCell,
    header: "Avg Session",
  },
]

@Component({
  imports: [TableModule],
  selector: "custom-cell-demo",
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
                  <th *renderHeader="header; let value" q-table-header-cell>
                    {{ value }}
                  </th>
                }
              </tr>
            }
          </thead>
          <tbody q-table-body>
            @for (row of table.getRowModel().rows; track row.id) {
              <tr q-table-row>
                @for (cell of row.getVisibleCells(); track cell.id) {
                  <td q-table-cell>
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
export class CustomCellDemo {
  protected table = createAngularTable<User>(() => ({
    columns,
    data: users,
    getCoreRowModel: getCoreRowModel(),
  }))
}
