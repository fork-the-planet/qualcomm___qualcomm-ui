import type {ReactElement} from "react"

export interface NotFoundPageProps {}

export function NotFoundPage({...props}: NotFoundPageProps): ReactElement {
  return <h1>Not Found</h1>
}
