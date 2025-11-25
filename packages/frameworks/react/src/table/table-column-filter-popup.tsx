import type {ReactElement, ReactNode} from "react"

import {Popover} from "@qualcomm-ui/react/popover"
import {Portal} from "@qualcomm-ui/react-core/portal"

import {
  TableColumnFilterAction,
  type TableColumnFilterActionProps,
} from "./table-column-filter-action"

export interface TableColumnFilterPopupProps
  extends TableColumnFilterActionProps {
  /**
   * The content of the filter popover.
   */
  children: ReactNode
}

export function TableColumnFilterPopup({
  children,
  ...props
}: TableColumnFilterPopupProps): ReactElement | null {
  if (!props.canFilter && !props.header?.column.getCanFilter()) {
    return null
  }
  return (
    <Popover.Root>
      <Popover.Anchor>
        <Popover.Trigger>
          <TableColumnFilterAction {...props} />
        </Popover.Trigger>
      </Popover.Anchor>

      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            {children}
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
