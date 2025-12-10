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
      className="q-swagger-input"
      disabled={disabled}
      errorText={errors.length ? errors[0] : ""}
      invalid={errors.length > 0}
      onValueChange={onChange}
      placeholder={description}
      value={value}
    />
  )
}
