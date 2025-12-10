import {LockIcon, LockOpenIcon} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"

import type {GetComponent} from "../types"

interface AuthorizeBtnProps {
  getComponent: GetComponent
  isAuthorized?: boolean
  onClick?: () => void
  showPopup?: boolean
}

export function AuthorizeBtn({
  getComponent,
  isAuthorized,
  onClick,
  showPopup,
}: AuthorizeBtnProps) {
  const AuthorizationPopup = getComponent("authorizationPopup", true)

  return (
    <div className="auth-wrapper">
      <Button
        emphasis="primary"
        endIcon={isAuthorized ? LockIcon : LockOpenIcon}
        onClick={onClick}
        variant="fill"
      >
        Authorize
      </Button>
      {showPopup && <AuthorizationPopup />}
    </div>
  )
}
