import type {ReactElement} from "react"

import {
  CoreFileUpload,
  type CoreFileUploadContextProps,
} from "@qualcomm-ui/react-core/file-upload"

export interface FileUploadContextProps extends CoreFileUploadContextProps {}

export function FileUploadContext(props: FileUploadContextProps): ReactElement {
  return <CoreFileUpload.Context {...props} />
}
