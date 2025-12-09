import {ChangeEvent, ReactNode} from "react"

import {QTextInput} from "@qui/react"

import {JsonSchemaProps} from "./types"

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

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeProp(e.target.value, keyName)
  }

  const errors = errorsProp.toJS ? errorsProp.toJS() : []

  const value = valueProp || ""

  return (
    <QTextInput
      className="q-swagger-input"
      disabled={disabled}
      error={errors.length ? errors[0] : ""}
      onChange={(event) => onChange(event as ChangeEvent<HTMLInputElement>)}
      placeholder={description}
      value={value}
    />
  )
}
