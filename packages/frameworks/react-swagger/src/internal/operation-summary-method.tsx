import {ReactNode} from "react"

import {clsx} from "@qui/base"
import {QButton, QButtonProps} from "@qui/react"

OperationSummaryMethod.displayName = "OperationSummaryMethod"

export interface OperationSummaryMethodProps {
  method: string
}

const propsMap: Record<string, QButtonProps<"div">> = {
  delete: {
    color: "negative",
  },
  get: {
    color: "positive",
  },
  head: {
    className: "q-purple",
    color: "positive",
  },
  options: {
    className: "q-kiwi",
    color: "positive",
  },
  patch: {
    className: "q-orange",
    color: "warning",
  },
  post: {
    color: "primary",
  },
  put: {
    color: "warning",
  },
  trace: {
    className: "q-teal",
    color: "positive",
  },
}

export function OperationSummaryMethod({
  method,
}: OperationSummaryMethodProps): ReactNode {
  const buttonProps = propsMap[method]

  return (
    <QButton
      {...buttonProps}
      as="div"
      className={clsx(buttonProps?.className, "qui-method-button", method)}
      tabIndex={-1}
      variant="fill"
    >
      {method.toUpperCase()}
    </QButton>
  )
}
