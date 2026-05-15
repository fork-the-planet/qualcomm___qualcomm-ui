import type {ReactElement} from "react"

import {X} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import {
  CoreFileUpload,
  type CoreFileUploadItemDeleteTriggerProps,
} from "@qualcomm-ui/react-core/file-upload"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFileUploadContext} from "./qds-file-upload-context"

export interface FileUploadItemDeleteButtonProps extends CoreFileUploadItemDeleteTriggerProps {
  /**
   * Lucide-react icon or JSX element
   *
   * @default Trash2
   */
  icon?: LucideIconOrElement
}

export function FileUploadItemDeleteButton({
  render,
  ...props
}: FileUploadItemDeleteButtonProps): ReactElement {
  const qdsContext = useQdsFileUploadContext()
  const mergedProps = mergeProps(
    qdsContext.getItemDeleteTriggerBindings(),
    props,
  )

  return (
    <CoreFileUpload.ItemDeleteTrigger
      render={
        <IconButton
          density="compact"
          icon={X}
          size="lg"
          variant="ghost"
          {...mergedProps}
          render={render}
        />
      }
    />
  )
}
