import {
  CdkDrag,
  type CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
} from "@angular/cdk/drag-drop"
import {Component, signal} from "@angular/core"

import {
  type AngularTable,
  createAngularTable,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {type ColumnOrderState, getCoreRowModel} from "@qualcomm-ui/core/table"

import {createUserQuery, type User, userColumns} from "./data"

@Component({
  imports: [TableModule, CdkDropList, CdkDrag, CdkDragHandle],
  selector: "column-dnd-demo",
  template: `
    <div q-table-root>
      <div q-table-scroll-container>
        <table q-table-table>
          <thead q-table-header>
            @for (
              headerGroup of table.getHeaderGroups();
              track headerGroup.id
            ) {
              <tr
                cdkDropList
                cdkDropListOrientation="horizontal"
                q-table-row
                (cdkDropListDropped)="onColumnDropped($event)"
              >
                @for (header of headerGroup.headers; track header.id) {
                  @if (!header.isPlaceholder) {
                    <th cdkDrag q-table-header-cell>
                      <ng-container *renderHeader="header; let value">
                        {{ value }}
                      </ng-container>
                      <button cdkDragHandle q-table-column-drag-handle></button>
                    </th>
                  }
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
export class ColumnDndDemo {
  readonly query = createUserQuery(10)

  onColumnDropped(col: CdkDragDrop<any>) {
    this.columnOrder.update((prevOrder) => {
      const columnOrder = [...prevOrder]
      return this.reorderColumn(
        columnOrder[col.previousIndex],
        columnOrder[col.currentIndex],
        columnOrder,
      )
    })
  }

  private reorderColumn(
    draggedColumnId: string,
    targetColumnId: string,
    columnOrder: string[],
  ): ColumnOrderState {
    columnOrder.splice(
      columnOrder.indexOf(targetColumnId),
      0,
      columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0],
    )
    console.debug("new order", columnOrder)
    return columnOrder
  }

  protected readonly columnOrder = signal(
    userColumns.map((column) => column.id!),
  )

  protected table: AngularTable<User> = createAngularTable(() => ({
    columns: userColumns,
    data: this.query.data() || [],
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnOrder: this.columnOrder(),
    },
  }))
}
