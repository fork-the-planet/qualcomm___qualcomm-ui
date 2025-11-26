import {useQuery} from "@tanstack/react-query"

import type {ColumnDef} from "@qualcomm-ui/core/table"

export interface User {
  accountStatus: string
  firstName: string
  lastName: string
  role: string
  username: string
  visitCount: number
}

export interface UserColumnMeta {
  filterLabel?: string
}

export const userColumns: ColumnDef<User, any, UserColumnMeta>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    id: "firstName",
    meta: {filterLabel: "First Name"},
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    id: "lastName",
    meta: {filterLabel: "Last Name"},
  },
  {
    accessorKey: "username",
    header: "Username",
    id: "username",
    meta: {filterLabel: "Username"},
  },
  {
    accessorKey: "visitCount",
    header: "Visit Count",
    id: "visitCount",
    meta: {filterLabel: "Visit Count"},
  },
  {
    accessorKey: "role",
    header: "Role",
    id: "role",
    meta: {filterLabel: "Role"},
  },
  {
    accessorKey: "accountStatus",
    header: "Account Status",
    id: "accountStatus",
    meta: {filterLabel: "Account Status"},
  },
]

export function useUserData(...dimensions: number[]) {
  return useQuery({
    queryFn: async () => {
      const data = await fetch("/get-mock-user-data", {
        body: JSON.stringify({size: dimensions}),
        headers: {"Content-Type": "application/json"},
        method: "POST",
      }).then((res) => res.json())
      return data
    },
    queryKey: ["mockUserData", dimensions],
    refetchInterval: false,
    refetchOnMount: false,
  })
}
