// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DocsCodeMirror} from "../code-mirror"

import type {GetComponent} from "./types"
import {useThemeContext} from "./use-theme-context"
import {jsFileDownload} from "./utils"

interface HighlightCodeProps {
  canCopy?: boolean
  children: string
  className?: string
  downloadable?: boolean
  fileName?: string
  fn: any
  getComponent: GetComponent
  language?: string
}

export function HighlightCode({
  canCopy,
  children,
  downloadable,
  fileName = "response.txt",
  language,
}: HighlightCodeProps) {
  const handleDownload = () => {
    jsFileDownload(children, fileName)
  }

  const copyable =
    canCopy || children?.startsWith("{") || children?.startsWith("[")

  const theme = useThemeContext()

  return (
    <div className="qui-code-mirror" style={{maxWidth: 700}}>
      <DocsCodeMirror
        copyable={copyable}
        downloadable={downloadable}
        handleDownload={handleDownload}
        language={language}
        theme={theme}
        value={children}
      />
    </div>
  )
}
