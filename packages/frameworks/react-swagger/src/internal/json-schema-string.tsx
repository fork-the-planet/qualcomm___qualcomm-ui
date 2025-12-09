import {ChangeEvent, ReactNode} from "react"

import {QCombobox, QTextInput} from "@qui/react"

import {JsonSchemaProps} from "./types"

JsonSchemaString.displayName = "JsonSchemaString"

export function JsonSchemaString({
  description,
  disabled,
  errors: errorsProp,
  keyName,
  onChange: onChangeProp,
  required,
  schema,
  value: valueProp,
}: JsonSchemaProps): ReactNode {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value =
      schema && schema.get("type") === "file"
        ? e.target.files?.[0]
        : e.target.value
    onChangeProp?.(value, keyName)
  }

  const enumValue = schema && schema.get ? schema.get("enum") : null
  const format = schema && schema.get ? schema.get("format") : null
  const type = schema && schema.get ? schema.get("type") : null
  const schemaIn = schema && schema.get ? schema.get("in") : null
  const value = valueProp ? valueProp : ""
  const errors = errorsProp.toJS ? errorsProp.toJS() : []

  if (enumValue) {
    return (
      <QCombobox
        className="q-swagger-input"
        clearable={!required}
        disableOptionToggle={required}
        disabled={disabled}
        error={errors.length ? errors[0] : ""}
        onChange={(event, value) => onChangeProp?.(value)}
        options={[...enumValue]}
        value={value}
      />
    )
  }

  const isDisabled =
    disabled ||
    !!(schemaIn && schemaIn === "formData" && !("FormData" in window))

  if (type && type === "file") {
    return (
      <input
        disabled={isDisabled}
        onChange={(event) => onChange(event as ChangeEvent<HTMLInputElement>)}
        type="file"
      />
    )
  }

  return (
    <QTextInput
      className="q-swagger-input"
      disabled={isDisabled}
      error={errors.length ? errors[0] : ""}
      inputProps={{type: format && format === "password" ? "password" : "text"}}
      onChange={(event) => onChange(event as ChangeEvent<HTMLInputElement>)}
      placeholder={description}
      value={value}
    />
  )
}
