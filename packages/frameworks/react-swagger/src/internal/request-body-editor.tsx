// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useEffect, useState} from "react"

import {DocsCodeMirror} from "../code-mirror"

import type {GetComponent} from "./types"
import {useThemeContext} from "./use-theme-context"
import {stringify} from "./utils"

RequestBodyEditor.displayName = "RequestBodyEditor"

export interface RequestBodyEditorProps {
  defaultValue?: string
  errors?: any[]
  getComponent: GetComponent
  onChange?: (value: string) => void
  value?: string
}

export function RequestBodyEditor(props: RequestBodyEditorProps): ReactNode {
  const [state, setState] = useState(
    stringify(props.value || props.defaultValue),
  )

  useEffect(() => {
    setState(stringify(props.value || props.defaultValue))
  }, [props.defaultValue, props.value])

  const theme = useThemeContext()

  return (
    <DocsCodeMirror
      editable
      language="json"
      onChange={(value) => {
        props.onChange?.(value)
      }}
      theme={theme}
      value={state}
    />
  )
}
