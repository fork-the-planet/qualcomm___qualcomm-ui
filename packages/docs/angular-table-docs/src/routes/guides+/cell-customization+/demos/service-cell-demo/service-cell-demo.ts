import {Component, inject} from "@angular/core"

import {
  type AngularTable,
  createAngularTable,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {type ColumnDef, getCoreRowModel} from "@qualcomm-ui/core/table"

import {DurationCell} from "./duration-cell"
import {EditableStatusCell} from "./editable-status-cell"
import {type User, UserDataService} from "./user-data.service"

const userColumns: ColumnDef<User, any>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "accountStatus",
    cell: () => EditableStatusCell,
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
  providers: [UserDataService],
  selector: "service-cell-demo",
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
                  <th q-table-header-cell>
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
export class ServiceCellDemo {
  protected readonly data = inject(UserDataService).data

  protected readonly table: AngularTable<User> = createAngularTable(() => ({
    columns: userColumns,
    data: this.data(),
    getCoreRowModel: getCoreRowModel(),
  }))
}
