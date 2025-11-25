import {Component} from "@angular/core"

import {createAngularTable, TableModule} from "@qualcomm-ui/angular/table"
import {getCoreRowModel} from "@qualcomm-ui/core/table"
import type {QdsTableSize} from "@qualcomm-ui/qds-core/table"

import {userColumns, userData} from "./data"

@Component({
  imports: [TableModule],
  selector: "table-size-demo",
  template: `
    <div class="flex w-full flex-col gap-8">
      @for (size of sizes; track size) {
        <div q-table-root [size]="size">
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
      }
    </div>
  `,
})
export class TableSizeDemo {
  sizes: QdsTableSize[] = ["sm", "md", "lg"]

  protected readonly table = createAngularTable(() => ({
    columns: userColumns,
    data: userData,
    getCoreRowModel: getCoreRowModel(),
  }))
}
