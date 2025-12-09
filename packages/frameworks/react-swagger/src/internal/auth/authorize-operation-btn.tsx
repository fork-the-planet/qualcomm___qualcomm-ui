import {MouseEvent, ReactNode} from "react"

import {LockIcon, LockOpenIcon} from "lucide-react"

import {QIconButton} from "@qui/react"

AuthorizeOperationBtn.displayName = "AuthorizeOperationBtn"

export interface AuthorizeOperationBtnProps {
  getComponent: () => any
  isAuthorized: boolean
  onClick?: () => void
}

export function AuthorizeOperationBtn(
  props: AuthorizeOperationBtnProps,
): ReactNode {
  function onClick(e: MouseEvent) {
    e.stopPropagation()

    props.onClick?.()
  }

  const {isAuthorized} = props

  return (
    <QIconButton
      aria-label={
        isAuthorized
          ? "authorization button locked"
          : "authorization button unlocked"
      }
      icon={isAuthorized ? LockIcon : LockOpenIcon}
      onClick={onClick}
    />
  )
}
