import {Trash2Icon} from "lucide-react"

import {QButton} from "@qui/react"

interface ClearProps {
  method: string
  path: string
  specActions: any
}

export function Clear(props: ClearProps) {
  const onClick = () => {
    const {method, path, specActions} = props
    specActions.clearResponse(path, method)
    specActions.clearRequest(path, method)
  }

  return (
    <QButton endIcon={Trash2Icon} onClick={onClick} size="l" variant="fill">
      Clear
    </QButton>
  )
}
