// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {DocsCodeMirror} from "../code-mirror"

import type {JsonSchemaProps} from "./types"
import {useThemeContext} from "./use-theme-context"
import {stringify} from "./utils"

JsonSchemaObject.displayName = "JsonSchemaObject"

export function JsonSchemaObject(props: JsonSchemaProps): ReactNode {
  const onChange = (value: any) => {
    props.onChange?.(value)
  }

  const handleOnChange = (value: string) => {
    onChange(value)
  }

  const {disabled, value} = props

  const theme = useThemeContext()

  return (
    <div>
      <DocsCodeMirror
        basicSetup={{
          foldGutter: false,
          lineNumbers: false,
          lintKeymap: true,
        }}
        editable={!disabled}
        language="json"
        onChange={handleOnChange}
        theme={theme}
        value={stringify(value)}
      />
    </div>
  )
}
