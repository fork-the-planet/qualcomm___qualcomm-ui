import {Fragment, type ReactNode} from "react"

OperationSummaryPath.displayName = "OperationSummaryPath"

export interface OperationSummaryPathProps {
  operationProps: any
}

export function OperationSummaryPath({
  operationProps,
}: OperationSummaryPathProps): ReactNode {
  const {deprecated, path} = operationProps.toJS()

  /**
   * Add <wbr> word-break elements between each segment, before the slash
   * to allow browsers an opportunity to break long paths into sensible segments.
   */
  const pathParts: ReactNode[] = path.split(/(?=\/)/g)
  for (let i = 1; i < pathParts.length; i += 2) {
    pathParts.splice(i, 0, <wbr key={i} />)
  }

  return (
    <span
      className={
        deprecated ? "opblock-summary-path__deprecated" : "opblock-summary-path"
      }
      data-path={path}
    >
      {pathParts.map((part, i: number) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </span>
  )
}
