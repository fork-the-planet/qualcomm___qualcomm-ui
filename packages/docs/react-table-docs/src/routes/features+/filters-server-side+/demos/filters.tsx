import type {Column, ColumnFiltersState} from "@qualcomm-ui/core/table"
import {NumberInput} from "@qualcomm-ui/react/number-input"
import {TextInput} from "@qualcomm-ui/react/text-input"

import type {User} from "./use-data"

interface TableColumnFilterProps {
  column: Column<User>
  columnFilters: ColumnFiltersState
  onColumnFiltersChange: (filters: ColumnFiltersState) => void
}

function getFilterValue(columnFilters: ColumnFiltersState, columnId: string) {
  return columnFilters.find((f) => f.id === columnId)?.value
}

function setFilterValue(
  columnFilters: ColumnFiltersState,
  columnId: string,
  value: unknown,
): ColumnFiltersState {
  const existing = columnFilters.find((f) => f.id === columnId)

  // Remove filter if value is empty
  if (
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.every((v) => v === undefined || v === 0))
  ) {
    return columnFilters.filter((f) => f.id !== columnId)
  }

  if (existing) {
    return columnFilters.map((f) => (f.id === columnId ? {...f, value} : f))
  }

  return [...columnFilters, {id: columnId, value}]
}

export function TableColumnFilter({
  column,
  columnFilters,
  onColumnFiltersChange,
}: TableColumnFilterProps) {
  const isNumericColumn = column.id === "visitCount"

  return isNumericColumn ? (
    <MinMaxNumberFilter
      column={column}
      columnFilters={columnFilters}
      onColumnFiltersChange={onColumnFiltersChange}
    />
  ) : (
    <TextInput
      className="w-32"
      onValueChange={(value) =>
        onColumnFiltersChange(setFilterValue(columnFilters, column.id, value))
      }
      placeholder="Search..."
      size="sm"
      value={(getFilterValue(columnFilters, column.id) as string) ?? ""}
    />
  )
}

export function MinMaxNumberFilter({
  column,
  columnFilters,
  onColumnFiltersChange,
}: TableColumnFilterProps) {
  const filterValue = getFilterValue(columnFilters, column.id) as
    | [number, number]
    | undefined

  const [min, max] = filterValue ?? [0, 0]

  return (
    <div className="flex w-32 gap-2">
      <NumberInput
        controlProps={{hidden: true}}
        min={0}
        onValueChange={({valueAsNumber}) =>
          onColumnFiltersChange(
            setFilterValue(columnFilters, column.id, [
              valueAsNumber,
              filterValue?.[1],
            ]),
          )
        }
        placeholder="Min"
        size="sm"
        value={min ? `${min}` : ""}
      />
      <NumberInput
        controlProps={{hidden: true}}
        max={999}
        onValueChange={({valueAsNumber}) =>
          onColumnFiltersChange(
            setFilterValue(columnFilters, column.id, [
              filterValue?.[0],
              valueAsNumber,
            ]),
          )
        }
        placeholder="Max"
        size="sm"
        value={max ? `${max}` : ""}
      />
    </div>
  )
}
