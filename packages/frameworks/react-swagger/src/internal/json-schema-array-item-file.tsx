// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ChangeEvent, ReactNode} from "react"

import type {JsonSchemaProps} from "./types"

JsonSchemaArrayItemFile.displayName = "JsonSchemaArrayItemFile"

export function JsonSchemaArrayItemFile(props: JsonSchemaProps): ReactNode {
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.files![0]
    props.onChange?.(value, props.keyName)
  }

  const {disabled, errors, getComponent} = props
  const Input = getComponent("Input")
  const isDisabled = disabled || !("FormData" in window)

  return (
    <Input
      className={errors.size ? "invalid" : ""}
      disabled={isDisabled}
      onChange={onFileChange}
      title={errors.size ? errors : ""}
      type="file"
    />
  )
}
