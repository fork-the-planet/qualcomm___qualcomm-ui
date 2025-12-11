import {type ChangeEvent, type ReactNode, useMemo} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Select} from "@qualcomm-ui/react/select"
import {TextInput} from "@qualcomm-ui/react/text-input"

import type {JsonSchemaProps} from "./types"

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
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.files?.[0]
    onChangeProp?.(value, keyName)
  }

  const enumValue = schema && schema.get ? schema.get("enum") : null
  const format = schema && schema.get ? schema.get("format") : null
  const type = schema && schema.get ? schema.get("type") : null
  const schemaIn = schema && schema.get ? schema.get("in") : null
  const value = valueProp ? valueProp : ""
  const errors = errorsProp.toJS ? errorsProp.toJS() : []

  const enumCollection = useMemo(() => {
    if (!enumValue) {
      return null
    }
    return selectCollection({items: [...enumValue]})
  }, [enumValue])

  if (enumValue && enumCollection) {
    return (
      <Select
        clearable={!required}
        collection={enumCollection}
        disabled={disabled}
        invalid={errors.length > 0}
        onValueChange={(value) => onChangeProp?.(value[0])}
        size="sm"
        value={value ? [value] : []}
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
        onChange={(event) => onFileChange(event)}
        type="file"
      />
    )
  }

  return (
    <TextInput
      className="q-swagger-input"
      disabled={isDisabled}
      errorText={errors.length ? errors[0] : ""}
      inputProps={{type: format && format === "password" ? "password" : "text"}}
      invalid={errors.length > 0}
      onValueChange={(val) => onChangeProp?.(val, keyName)}
      placeholder={description}
      size="sm"
      value={value}
    />
  )
}
