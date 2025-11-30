import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {
  type AngularTable,
  createAngularTable,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {getCoreRowModel, getSortedRowModel} from "@qualcomm-ui/core/table"

import {createUserQuery, type User, userColumns} from "./data"

@Component({
  imports: [TableModule, ButtonModule, ProgressRingModule],
  selector: "sorting-demo",
  template: `
    <div q-table-root>
      <div q-table-action-bar>
        <button
          q-button
          size="sm"
          variant="outline"
          [disabled]="query.isFetching()"
          (click)="query.refetch()"
        >
          Refresh Data
        </button>
        @if (query.isFetching()) {
          <div q-progress-ring size="xs"></div>
        }
      </div>
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
                    <div class="inline-flex items-center gap-2">
                      <ng-container *renderHeader="header; let value">
                        {{ value }}
                      </ng-container>
                      <button
                        q-table-column-sort-action
                        [header]="header"
                        [isSorted]="header.column.getIsSorted()"
                      ></button>
                    </div>
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
export class SortingDemo {
  protected readonly query = createUserQuery(10)

  protected table: AngularTable<User> = createAngularTable(() => ({
    columns: userColumns,
    data: this.query.data() || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  }))
}
