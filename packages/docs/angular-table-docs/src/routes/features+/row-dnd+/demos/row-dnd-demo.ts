import {
  CdkDrag,
  type CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from "@angular/cdk/drag-drop"
import {Component, effect, signal} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {
  type AngularTable,
  createAngularTable,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {getCoreRowModel} from "@qualcomm-ui/core/table"

import {createUserQuery, type User, userColumns} from "./data"

@Component({
  imports: [
    TableModule,
    ButtonModule,
    ProgressRingModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
  ],
  selector: "row-dnd-demo",
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
          Regenerate
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
                <th q-table-header-cell></th>
                @for (header of headerGroup.headers; track header.id) {
                  <th
                    q-table-header-cell
                    [attr.colspan]="header.colSpan"
                    [style.width.px]="header.getSize()"
                  >
                    <ng-container *renderHeader="header; let value">
                      {{ value }}
                    </ng-container>
                  </th>
                }
              </tr>
            }
          </thead>
          <tbody
            cdkDropList
            q-table-body
            (cdkDropListDropped)="onRowDropped($event)"
          >
            @for (row of table.getRowModel().rows; track row.id) {
              <tr cdkDrag q-table-row>
                <td class="p-2" q-table-cell>
                  <button cdkDragHandle q-table-row-drag-handle></button>
                </td>
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
export class RowDndDemo {
  protected readonly query = createUserQuery(10)
  protected readonly mutableData = signal<User[]>([])

  constructor() {
    effect(() => {
      const data = this.query.data()
      if (data) {
        this.mutableData.set([...data])
      }
    })
  }

  protected table: AngularTable<User> = createAngularTable(() => ({
    columns: userColumns,
    data: this.mutableData(),
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.userId,
  }))

  onRowDropped(event: CdkDragDrop<User[]>) {
    this.mutableData.update((data) => {
      const newData = [...data]
      moveItemInArray(newData, event.previousIndex, event.currentIndex)
      return newData
    })
  }
}
