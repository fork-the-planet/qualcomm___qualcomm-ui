// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {MouseEventHandler, ReactNode} from "react"

import {FlaskConicalIcon, RotateCcw, XIcon} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"

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
        <Button
          emphasis="danger"
          endIcon={XIcon}
          onClick={onCancelClick}
          variant="outline"
        >
          Cancel
        </Button>
      ) : (
        <Button
          emphasis="primary"
          endIcon={FlaskConicalIcon}
          onClick={onTryoutClick}
          variant="outline"
        >
          Try it out
        </Button>
      )}
      {showReset && (
        <Button
          emphasis="neutral"
          endIcon={RotateCcw}
          onClick={onResetClick}
          variant="outline"
        >
          Reset
        </Button>
      )}
    </div>
  )
}
