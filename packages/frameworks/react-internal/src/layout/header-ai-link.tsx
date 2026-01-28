// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Bot} from "lucide-react"

import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Tooltip} from "@qualcomm-ui/react/tooltip"

export function HeaderAiLink(): ReactElement {
  return (
    <Tooltip
      portalProps={{disabled: true}}
      trigger={
        <HeaderBar.ActionIconButton
          aria-label="QUI AI Assistant (QC-only)"
          icon={Bot}
          render={
            <a
              href="https://qui-ai.qualcomm.com/docs/"
              rel="noreferrer"
              target="_blank"
            />
          }
        />
      }
    >
      QUI AI Assistant (QC-only)
    </Tooltip>
  )
}
