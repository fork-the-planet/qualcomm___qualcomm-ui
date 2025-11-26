import type {Column, TableInstance} from "@qualcomm-ui/core/table"
import {InputLabel} from "@qualcomm-ui/react/input"
import {NumberInput} from "@qualcomm-ui/react/number-input"
import {TextInput} from "@qualcomm-ui/react/text-input"

import type {User, UserColumnMeta} from "./use-data"

interface TableColumnFilterProps {
  column: Column<User, any, UserColumnMeta>
  table: TableInstance<User>
}

export function TableColumnFilter({column, table}: TableColumnFilterProps) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  return typeof firstValue === "number" ? (
    <MinMaxNumberFilter column={column} table={table} />
  ) : (
    <TextInput
      className="w-32"
      label={column.columnDef.meta?.filterLabel}
      onValueChange={(value) => column.setFilterValue(value)}
      placeholder="Search..."
      size="sm"
      value={(column.getFilterValue() as string) ?? ""}
    />
  )
}

export function MinMaxNumberFilter({column}: TableColumnFilterProps) {
  const columnFilterValue = column.getFilterValue() as [number, number]

  const filterLabel = column.columnDef.meta?.filterLabel

  const [min, max] = columnFilterValue ?? [0, 0]

  return (
    <div className="flex flex-col gap-1">
      {filterLabel ? <InputLabel>{filterLabel}</InputLabel> : null}
      <div className="flex w-32 gap-2">
        <NumberInput
          controlProps={{hidden: true}}
          inputProps={{"aria-label": `${filterLabel} min`}}
          min={0}
          onValueChange={({valueAsNumber}) =>
            column.setFilterValue((old: [number, number]) => {
              const nextValue = [valueAsNumber, old?.[1]]
              return nextValue.every((v) => v === undefined || isNaN(v))
                ? undefined
                : nextValue
            })
          }
          placeholder="Min"
          size="sm"
          value={min ? `${min}` : ""}
        />
        <NumberInput
          controlProps={{hidden: true}}
          inputProps={{"aria-label": `${filterLabel} max`}}
          max={130}
          onValueChange={({valueAsNumber}) =>
            column.setFilterValue((old: [number, number]) => {
              const nextValue = [old?.[0], valueAsNumber]
              return nextValue.every((v) => v === undefined || isNaN(v))
                ? undefined
                : nextValue
            })
          }
          placeholder="Max"
          size="sm"
          value={max ? `${max}` : ""}
        />
      </div>
    </div>
  )
}
