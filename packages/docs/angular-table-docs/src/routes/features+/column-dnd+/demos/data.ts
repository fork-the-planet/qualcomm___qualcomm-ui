import {signal} from "@angular/core"
import {
  type CreateQueryResult,
  injectQuery,
} from "@tanstack/angular-query-experimental"

import {type ColumnDef, createColumnHelper} from "@qualcomm-ui/core/table"

export interface User {
  accountStatus: string
  averageSessionDuration: number
  companyName: string
  lastVisitedAt: string
  role: string
  userId: string
  username: string
  visitCount: number
}

const columnHelper = createColumnHelper<User>()

export const userColumns: ColumnDef<User, any>[] = [
  columnHelper.accessor("username", {
    header: "Username",
    id: "username",
    minSize: 200,
  }),
  columnHelper.accessor("accountStatus", {
    header: "Account Status",
    id: "accountStatus",
  }),
  columnHelper.accessor("role", {
    header: "Role",
    id: "role",
    minSize: 180,
  }),
  columnHelper.accessor("averageSessionDuration", {
    header: "Avg Session Duration",
    id: "averageSessionDuration",
  }),
  columnHelper.accessor("companyName", {
    header: "Company Name",
    id: "companyName",
    minSize: 220,
  }),
  columnHelper.accessor("lastVisitedAt", {
    header: "Last Visited At",
    id: "lastVisitedAt",
    minSize: 205,
  }),
  columnHelper.accessor("visitCount", {
    header: "Visit Count",
    id: "visitCount",
  }),
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
    queryKey: ["mock-user-data", "column-dnd", dimensions],
    refetchOnWindowFocus: false,
  }))
}
