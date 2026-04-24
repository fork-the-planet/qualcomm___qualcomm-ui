import type {NavBadge} from "./docs-plugin.types"

/**
 * @since 2.2.0
 */
export function isNavBadge(obj: unknown): obj is NavBadge {
  return (
    typeof obj === "object" &&
    !!obj &&
    "label" in obj &&
    "id" in obj &&
    typeof obj.label === "string" &&
    (!("url" in obj) ||
      ("url" in obj && (typeof obj.url === "string" || !obj.url)))
  )
}
