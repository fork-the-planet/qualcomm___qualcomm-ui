import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {TextInputModule} from "@qualcomm-ui/angular/text-input"
import {selectCollection} from "@qualcomm-ui/core/select"
import type {Column, ColumnFiltersState} from "@qualcomm-ui/core/table"

import type {User, UserColumnMeta} from "./data"
import {MinMaxNumberFilter} from "./min-max-number-filter"

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
    (Array.isArray(value) &&
      value.every(
        (v) =>
          v === undefined || v === 0 || (typeof v === "number" && isNaN(v)),
      ))
  ) {
    return columnFilters.filter((f) => f.id !== columnId)
  }

  if (existing) {
    return columnFilters.map((f) => (f.id === columnId ? {...f, value} : f))
  }

  return [...columnFilters, {id: columnId, value}]
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MinMaxNumberFilter, TextInputModule, SelectModule, FormsModule],
  selector: "app-table-column-filter",
  template: `
    @if (isNumericColumn()) {
      <app-min-max-number-filter
        [column]="column()"
        [columnFilters]="columnFilters()"
        (columnFiltersChange)="columnFiltersChange.emit($event)"
      />
    } @else if (collection()) {
      <q-select
        class="w-32"
        disablePortal
        placeholder="All"
        size="sm"
        [collection]="collection()!"
        [label]="filterLabel()"
        [ngModel]="selectValue()"
        (ngModelChange)="onSelectChange($event)"
      />
    } @else {
      <q-text-input
        class="w-32"
        placeholder="Search..."
        size="sm"
        [label]="filterLabel()"
        [ngModel]="textValue()"
        (ngModelChange)="onTextChange($event)"
      />
    }
  `,
})
export class TableColumnFilter {
  readonly column = input.required<Column<User, any, UserColumnMeta>>()
  readonly columnFilters = input.required<ColumnFiltersState>()
  readonly availableFilters = input<Record<string, string[]>>()
  readonly columnFiltersChange = output<ColumnFiltersState>()

  readonly isNumericColumn = computed(() => this.column().id === "visitCount")

  readonly filterOptions = computed(
    () => this.availableFilters()?.[this.column().id],
  )

  readonly collection = computed(() => {
    const options = this.filterOptions()
    return options ? selectCollection({items: options}) : null
  })

  readonly filterLabel = computed(
    () => this.column().columnDef.meta?.filterLabel,
  )

  readonly textValue = computed(() => {
    return (
      (getFilterValue(this.columnFilters(), this.column().id) as string) ?? ""
    )
  })

  readonly selectValue = computed(() => {
    const value = getFilterValue(this.columnFilters(), this.column().id) as
      | string
      | undefined
    return value ? [value] : []
  })

  onTextChange(value: string) {
    this.columnFiltersChange.emit(
      setFilterValue(this.columnFilters(), this.column().id, value),
    )
  }

  onSelectChange(value: string[]) {
    this.columnFiltersChange.emit(
      setFilterValue(this.columnFilters(), this.column().id, value[0] ?? ""),
    )
  }
}
