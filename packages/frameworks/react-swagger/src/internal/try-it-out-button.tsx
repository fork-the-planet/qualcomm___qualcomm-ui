import {MouseEventHandler, ReactNode} from "react"

import {FlaskConicalIcon, RotateCcw, XIcon} from "lucide-react"

import {QButton} from "@qui/react"

TryItOutButton.displayName = "TryItOutButton"

export interface TryItOutButtonProps {
  enabled?: boolean
  // Try it out is enabled, ie: the user has access to the form
  hasUserEditedBody?: boolean
  // Try it out is enabled, ie: the user has access to the form
  isOAS3?: boolean
  onCancelClick?: MouseEventHandler<HTMLButtonElement>
  onResetClick?: MouseEventHandler<HTMLButtonElement>
  onTryoutClick?: MouseEventHandler<HTMLButtonElement> // Try it out is enabled, ie: the user has access to the form
}

export function TryItOutButton({
  enabled,
  hasUserEditedBody,
  isOAS3,
  onCancelClick,
  onResetClick,
  onTryoutClick,
}: TryItOutButtonProps): ReactNode {
  const showReset = isOAS3 && hasUserEditedBody
  return (
    <div className={showReset ? "try-out btn-group" : "try-out"}>
      {enabled ? (
        <QButton
          color="negative"
          endIcon={XIcon}
          onClick={onCancelClick}
          variant="outline"
        >
          Cancel
        </QButton>
      ) : (
        <QButton
          color="primary"
          endIcon={FlaskConicalIcon}
          onClick={onTryoutClick}
          variant="outline"
        >
          Try it out
        </QButton>
      )}
      {showReset && (
        <QButton
          color="warning"
          endIcon={RotateCcw}
          onClick={onResetClick}
          variant="outline"
        >
          Reset
        </QButton>
      )}
    </div>
  )
}
