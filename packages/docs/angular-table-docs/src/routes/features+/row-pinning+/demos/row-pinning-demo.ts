import {Component, inject} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"
import {PaginationModule} from "@qualcomm-ui/angular/pagination"
import {PopoverModule} from "@qualcomm-ui/angular/popover"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {
  type AngularTable,
  createAngularTable,
  createTablePagination,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
} from "@qualcomm-ui/core/table"

import {createUserQuery, type User, userColumns} from "./data"
import {RowPinningService} from "./row-pinning.service"

@Component({
  imports: [
    TableModule,
    PaginationModule,
    ButtonModule,
    ProgressRingModule,
    CheckboxModule,
    FormsModule,
    PopoverModule,
  ],
  providers: [RowPinningService],
  selector: "row-pinning-demo",
  template: `
    <div class="flex w-full flex-col gap-4 p-2">
      <div class="align-center vertical flex flex-col gap-2">
        <label
          label="Include Parent Rows When Pinning Child"
          q-checkbox
          size="sm"
          [ngModel]="rowPinningService.includeParentRows()"
          (ngModelChange)="rowPinningService.includeParentRows.set($event)"
        ></label>

        <label
          label="Include Leaf Rows When Pinning Parent"
          q-checkbox
          size="sm"
          [ngModel]="rowPinningService.includeLeafRows()"
          (ngModelChange)="rowPinningService.includeLeafRows.set($event)"
        ></label>

        <label
          label="Persist Pinned Rows across Pagination and Filtering"
          q-checkbox
          size="sm"
          [ngModel]="rowPinningService.keepPinnedRows()"
          (ngModelChange)="rowPinningService.keepPinnedRows.set($event)"
        ></label>
      </div>

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
                    <th q-table-header-cell [attr.colspan]="header.colSpan">
                      @if (!header.isPlaceholder) {
                        <div class="inline-flex flex-col gap-1">
                          <div
                            class="inline-flex min-h-[28px] items-center justify-center"
                          >
                            <ng-container *renderHeader="header; let value">
                              {{ value }}
                            </ng-container>
                          </div>
                        </div>
                      }
                    </th>
                  }
                </tr>
              }
            </thead>
            <tbody q-table-body>
              @for (row of table.getTopRows(); track row.id) {
                <tr q-table-row [isSelected]="true">
                  @for (cell of row.getVisibleCells(); track cell.id) {
                    <td q-table-cell>
                      <ng-container *renderCell="cell; let value">
                        {{ value }}
                      </ng-container>
                    </td>
                  }
                </tr>
              }
              @for (row of table.getCenterRows(); track row.id) {
                <tr q-table-row [isSelected]="row.getIsSelected()">
                  @for (cell of row.getVisibleCells(); track cell.id) {
                    <td q-table-cell>
                      <ng-container *renderCell="cell; let value">
                        {{ value }}
                      </ng-container>
                    </td>
                  }
                </tr>
              }
              @for (row of table.getBottomRows(); track row.id) {
                <tr q-table-row [isSelected]="true">
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
        <div
          q-table-pagination
          [count]="pagination.count()"
          [page]="pagination.page()"
          [pageSize]="pagination.pageSize()"
          (pageChanged)="pagination.onPageChange($event)"
        >
          <div *paginationContext="let context" q-pagination-page-metadata>
            @let meta = context.pageMetadata;
            {{ meta.pageStart }}-{{ meta.pageEnd }} of {{ meta.count }} results
          </div>

          <div q-pagination-page-buttons></div>
        </div>
      </div>
    </div>
  `,
})
export class RowPinningDemo {
  protected readonly query = createUserQuery(1000, 2, 2)

  protected readonly rowPinningService = inject(RowPinningService)

  protected table: AngularTable<User> = createAngularTable(() => ({
    columns: userColumns,
    data: this.query.data() || [],
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSubRows: (row: User) => row.subRows,
    initialState: {pagination: {pageIndex: 0, pageSize: 10}},
    keepPinnedRows: this.rowPinningService.keepPinnedRows(),
  }))

  protected pagination = createTablePagination(this.table)
}
