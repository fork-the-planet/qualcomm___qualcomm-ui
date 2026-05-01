import type {Context, Provider} from "react"

export type CreateContextReturn<T> = [
  Provider<T>,
  (requireContext?: boolean) => T,
  Context<T>,
]
