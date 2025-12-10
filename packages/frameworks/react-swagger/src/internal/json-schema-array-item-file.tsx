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
