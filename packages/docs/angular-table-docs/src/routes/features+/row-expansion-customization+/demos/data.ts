import {signal} from "@angular/core"
import {
  type CreateQueryResult,
  injectQuery,
} from "@tanstack/angular-query-experimental"

export interface User {
  accountStatus: string
  averageSessionDuration: number
  companyName: string
  lastVisitedAt: string
  role: string
  username: string
  visitCount: number
}

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
    queryKey: ["mock-user-data", "row-expansion-customization", dimensions],
    refetchOnWindowFocus: false,
  }))
}
