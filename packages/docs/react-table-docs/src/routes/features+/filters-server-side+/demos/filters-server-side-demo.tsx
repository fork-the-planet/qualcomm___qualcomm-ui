import {useMemo, useState} from "react"

import {useQuery} from "@tanstack/react-query"
import {Search} from "lucide-react"

import {
  type ColumnFiltersState,
  getCoreRowModel,
  type PaginationState,
} from "@qualcomm-ui/core/table"
import {Pagination} from "@qualcomm-ui/react/pagination"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {
  flexRender,
  Table,
  useReactTable,
  useTablePagination,
} from "@qualcomm-ui/react/table"
import {TextInput} from "@qualcomm-ui/react/text-input"
import {useDebounce} from "@qualcomm-ui/react-core/effects"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"

import {TableColumnFilter} from "./filters"
import {fetchData, userColumns} from "./use-data"

export function FiltersServerSideDemo() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const debouncedColumnFilters = useDebounce(columnFilters, 300)
  const debouncedGlobalFilter = useDebounce(globalFilter, 300)

  const {data, fetchStatus, isFetching} = useQuery({
    placeholderData: (previousData) => previousData,
    queryFn: () =>
      fetchData({
        columnFilters: debouncedColumnFilters,
        globalFilter: debouncedGlobalFilter,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      }),
    queryKey: [
      "data",
      pagination,
      debouncedColumnFilters,
      debouncedGlobalFilter,
    ],
  })

  const table = useReactTable({
    columns: userColumns,
    data: useMemo(() => data?.users ?? [], [data?.users]),
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualPagination: true,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    pageCount: data?.pageCount,
    state: {
      columnFilters,
      globalFilter,
      pagination,
    },
  })

  const paginationProps = useTablePagination(table, {
    totalCount: data?.totalUsers,
  })

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      <Table.Root>
        <Table.ActionBar>
          <TextInput
            className="w-56"
            onValueChange={setGlobalFilter}
            placeholder="Search all columns..."
            size="sm"
            startIcon={Search}
            value={globalFilter}
          />
          <div className="text-neutral-primary font-body-sm flex items-center gap-1">
            <span>Query:</span>
            <span>{fetchStatus}</span>{" "}
            {isFetching ? <ProgressRing className="ml-1" size="xs" /> : null}
          </div>
        </Table.ActionBar>
        <Table.ScrollContainer>
          <Table.Table>
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Table.HeaderCell
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{width: header.getSize()}}
                      >
                        {header.isPlaceholder ? null : (
                          <div className="inline-flex flex-col gap-1">
                            <div className="inline-flex min-h-[28px] items-center justify-center">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </div>
                            {header.column.getCanFilter() ? (
                              <TableColumnFilter
                                column={header.column}
                                columnFilters={columnFilters}
                                onColumnFiltersChange={setColumnFilters}
                              />
                            ) : null}
                          </div>
                        )}
                      </Table.HeaderCell>
                    )
                  })}
                </Table.Row>
              ))}
            </Table.Header>
            <Table.Body>
              {table.getRowModel().rows.map((row) => {
                return (
                  <Table.Row key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Table.Cell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Table.Cell>
                      )
                    })}
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table.Table>
        </Table.ScrollContainer>
        <Table.Pagination {...paginationProps}>
          <Pagination.PageMetadata>
            {({count, pageEnd, pageStart}) => (
              <>
                {!data?.pageCount ? (
                  <ProgressRing size="xs" />
                ) : (
                  `${pageStart}-${pageEnd} of ${count} results`
                )}
              </>
            )}
          </Pagination.PageMetadata>
          <Pagination.PageButtons />
        </Table.Pagination>
      </Table.Root>

      <CodeHighlight
        className="w-fit"
        code={JSON.stringify(
          {columnFilters, globalFilter, pagination},
          null,
          2,
        )}
        disableCopy
        language="json"
      />
    </div>
  )
}
