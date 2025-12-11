// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

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
    <Button endIcon={Trash2Icon} onClick={onClick} variant="outline">
      Clear
    </Button>
  )
}
