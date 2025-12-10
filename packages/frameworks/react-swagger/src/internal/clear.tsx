import {Trash2Icon} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"

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
    <Button endIcon={Trash2Icon} onClick={onClick} size="lg" variant="fill">
      Clear
    </Button>
  )
}
