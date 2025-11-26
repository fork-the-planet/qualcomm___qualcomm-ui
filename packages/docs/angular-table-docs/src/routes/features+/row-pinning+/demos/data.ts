import {signal} from "@angular/core"
import {
  type CreateQueryResult,
  injectQuery,
} from "@tanstack/angular-query-experimental"

import type {ColumnDef} from "@qualcomm-ui/core/table"

import {PinCell} from "./pin-cell"
import {UsernameCell} from "./username-cell"
import {UsernameHeader} from "./username-header"

export interface User {
  accountStatus: string
  averageSessionDuration: number
  companyName: string
  lastVisitedAt: string
  role: string
  subRows?: User[]
  username: string
  visitCount: number
}

export const userColumns: ColumnDef<User, any>[] = [
  {
    cell: () => PinCell,
    header: "Pin",
    id: "pin",
  },
  {
    accessorKey: "username",
    cell: () => UsernameCell,
    header: () => UsernameHeader,
    id: "username",
  },
  {
    accessorKey: "accountStatus",
    header: "Account Status",
    id: "accountStatus",
  },
  {
    accessorKey: "role",
    header: "Role",
    id: "role",
  },
  {
    accessorKey: "averageSessionDuration",
    header: "Avg Session Duration",
    id: "averageSessionDuration",
  },
  {
    accessorKey: "companyName",
    header: "Company Name",
    id: "companyName",
    minSize: 220,
  },
  {
    accessorKey: "lastVisitedAt",
    header: "Last Visited At",
    id: "lastVisitedAt",
    minSize: 205,
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
    queryKey: ["mock-user-data", "row-pinning", dimensions],
    refetchOnWindowFocus: false,
  }))
}
