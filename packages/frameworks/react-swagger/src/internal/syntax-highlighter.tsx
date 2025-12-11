// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {DocsCodeMirror} from "../code-mirror"

import {useThemeContext} from "./use-theme-context"

SyntaxHighlighter.displayName = "SyntaxHighlighter"

export interface SyntaxHighlighterProps {
  children: string
  fn: any
  language?: string
}

export function SyntaxHighlighter({
  children,
  ...props
}: SyntaxHighlighterProps): ReactNode {
  const theme = useThemeContext()

  return (
    <DocsCodeMirror language={props.language} theme={theme} value={children} />
  )
}
