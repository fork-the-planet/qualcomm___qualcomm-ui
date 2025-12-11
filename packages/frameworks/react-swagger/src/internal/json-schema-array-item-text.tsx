// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {TextInput} from "@qualcomm-ui/react/text-input"

import type {JsonSchemaProps} from "./types"

JsonSchemaArrayItemText.displayName = "JsonSchemaArrayItemText"

export function JsonSchemaArrayItemText(props: JsonSchemaProps): ReactNode {
  const {
    description,
    disabled,
    errors: errorsProp,
    keyName = "",
    onChange: onChangeProp = () => {},
    value: valueProp = "",
  } = props

  const onChange = (value: string) => {
    onChangeProp(value, keyName)
  }

  const errors = errorsProp.toJS ? errorsProp.toJS() : []

  const value = valueProp || ""

  return (
    <TextInput
      className="swagger-input"
      disabled={disabled}
      errorText={errors.length ? errors[0] : ""}
      invalid={errors.length > 0}
      onValueChange={onChange}
      placeholder={description}
      size="sm"
      value={value}
    />
  )
}
