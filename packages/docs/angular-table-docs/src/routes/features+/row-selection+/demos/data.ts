import {signal} from "@angular/core"
import {
  type CreateQueryResult,
  injectQuery,
} from "@tanstack/angular-query-experimental"
import dayjs from "dayjs"

import type {ColumnDef} from "@qualcomm-ui/core/table"

import {RowSelectionCell} from "./row-selection-cell"
import {RowSelectionHeader} from "./row-selection-header"

export interface User {
  accountStatus: string
  createdAt: string
  lastVisitedAt: string
  role: string
  username: string
  visitCount: number
}

export const userColumns: ColumnDef<User>[] = [
  {
    cell: () => RowSelectionCell,
    header: () => RowSelectionHeader,
    id: "select",
  },
  {
    accessorKey: "username",
    header: "Username",
    id: "username",
  },
  {
    accessorKey: "role",
    header: "Role",
    id: "role",
    size: 120,
  },
  {
    accessorKey: "accountStatus",
    header: "Account Status",
    id: "accountStatus",
  },
  {
    accessorKey: "createdAt",
    header: "Account Created On",
    id: "createdAt",
    minSize: 205,
    sortingFn: (rowA, rowB, columnId) => {
      const valueA: string = rowA.getValue(columnId)
      const valueB: string = rowB.getValue(columnId)
      return dayjs(valueA).isAfter(dayjs(valueB)) ? 1 : -1
    },
  },
  {
    accessorKey: "lastVisitedAt",
    header: "Last Visited At",
    id: "lastVisitedAt",
    minSize: 205,
    sortingFn: (rowA, rowB, columnId) => {
      const valueA: string = rowA.getValue(columnId)
      const valueB: string = rowB.getValue(columnId)
      return dayjs(valueA).isAfter(dayjs(valueB)) ? 1 : -1
    },
  },
  {
    accessorKey: "visitCount",
    header: "Visit Count",
    id: "visitCount",
  },
]

export function createUserQuery(
  ...dimensions: number[]
): CreateQueryResult<User[], Error> {
  // [!code hide]
  const isInitialLoad = signal(true)
  return injectQuery<User[]>(() => ({
    queryFn: async () => {
      const data = await fetch("/get-mock-user-data", {
        body: JSON.stringify({
          size: dimensions,
          // [!code hide]
          timestamp: isInitialLoad() ? 0 : Date.now(),
        }),
        headers: {"Content-Type": "application/json"},
        method: "POST",
      }).then((res) => res.json())
      // [!code hide]
      isInitialLoad.set(false)
      return data
    },
    queryKey: ["mock-user-data", "row-selection", dimensions],
    refetchOnWindowFocus: false,
  }))
}
