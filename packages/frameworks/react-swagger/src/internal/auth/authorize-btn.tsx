// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

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
