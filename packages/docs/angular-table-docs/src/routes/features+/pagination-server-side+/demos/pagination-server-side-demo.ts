import {Component, computed, signal} from "@angular/core"
import {injectQuery} from "@tanstack/angular-query-experimental"

import {PaginationModule} from "@qualcomm-ui/angular/pagination"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {
  type AngularTable,
  createAngularTable,
  createTablePagination,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {getCoreRowModel, type PaginationState} from "@qualcomm-ui/core/table"

import {fetchData, type FetchResult, type User, userColumns} from "./data"

@Component({
  imports: [TableModule, ProgressRingModule, PaginationModule],
  selector: "pagination-controlled-demo",
  template: `
    <div q-table-root>
      <div q-table-action-bar>
        <div class="text-neutral-primary font-body-sm flex items-center gap-1">
          <span>Query:</span>
          <span>{{ query.fetchStatus() }}</span>
          @if (query.isFetching()) {
            <div q-progress-ring size="xs"></div>
          }
        </div>
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
  `,
})
export class PaginationServerSideDemo {
  protected readonly paginationState = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  protected readonly query = injectQuery<FetchResult>(() => ({
    placeholderData: (previousData) => previousData,
    queryFn: async () => fetchData(this.paginationState()),
    queryKey: [
      "mock-user-data",
      "controlled-pagination",
      this.paginationState(),
    ],
  }))

  readonly queryData = computed(
    () => this.query.data() ?? {pageCount: 0, totalUsers: 0, users: []},
  )

  protected table: AngularTable<User> = createAngularTable(() => ({
    columns: userColumns,
    data: this.queryData().users,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange: (updater) => {
      // update the local signal whenever the internal pagination state changes
      if (typeof updater === "function") {
        this.paginationState.update(updater)
      } else {
        this.paginationState.set(updater)
      }
    },
    pageCount: this.queryData().pageCount || 0,
    state: {
      pagination: this.paginationState(),
    },
  }))

  protected pagination = createTablePagination(this.table, {
    totalCount: computed(() => this.queryData().totalUsers),
  })
}
