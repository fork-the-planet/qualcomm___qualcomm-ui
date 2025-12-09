import {useEffect, useState} from "react"

import {fromJS, List} from "immutable"
import {MinusIcon, PlusIcon} from "lucide-react"

import {QButton, QCombobox, QIconButton} from "@qui/react"

import {JsonSchemaArrayItemFile} from "./json-schema-array-item-file"
import {JsonSchemaArrayItemText} from "./json-schema-array-item-text"
import {JsonSchemaProps} from "./types"

JsonSchemaArray.displayName = "JsonSchemaArray"

function valueOrEmptyList(value: unknown) {
  return List.isList(value)
    ? value
    : Array.isArray(value)
      ? fromJS(value)
      : List()
}

export function JsonSchemaArray(props: JsonSchemaProps) {
  const {
    disabled,
    errors: errorsProp,
    fn,
    getComponent,
    onChange: onChangeProp = () => {},
    required = false,
    schema: schemaProp = {},
    value: valueProp = "",
  } = props

  const [value, setValue] = useState(valueOrEmptyList(valueProp))
  const [schema, setSchema] = useState(schemaProp)

  useEffect(() => {
    setSchema(schemaProp)
  }, [schemaProp])

  useEffect(() => {
    if (value !== valueProp) {
      setValue(valueOrEmptyList(valueProp))
    }
  }, [value, valueProp])

  const onChange = (updatedValue: List<any>) => {
    onChangeProp?.(updatedValue)
  }

  const onItemChange = (itemVal: any, i: number) => {
    const updatedValue = value.set(i, itemVal)
    setValue(updatedValue)
    onChange(updatedValue)
  }

  const removeItem = (i: number) => {
    const updatedValue = value.delete(i)
    setValue(updatedValue)
    onChange(updatedValue)
  }

  const addItem = () => {
    const newValue = valueOrEmptyList(value).push(
      fn.getSampleSchema(schema.get("items"), false, {
        includeWriteOnly: true,
      }),
    )
    setValue(newValue)
    onChange(newValue)
  }

  const onEnumChange = (value: any) => {
    setValue(value)
    onChange(value)
  }

  const errors: any = errorsProp.toJS
    ? errorsProp.toJS()
    : Array.isArray(errorsProp)
      ? errorsProp
      : []
  const arrayErrors = errors.filter((e: any) => typeof e === "string")
  const needsRemoveError = errors
    .filter((e: any) => e.needRemove !== undefined)
    .map((e: any) => e.error)
  const shouldRenderValue =
    value && value.count && value.count() > 0 ? true : false
  const schemaItemsEnum = schema.getIn(["items", "enum"])
  const schemaItemsType = schema.getIn(["items", "type"])
  const schemaItemsFormat = schema.getIn(["items", "format"])
  const schemaItemsSchema = schema.get("items")
  let ArrayItemsComponent: any
  let isArrayItemText = false
  const isArrayItemFile =
    schemaItemsType === "file" ||
    (schemaItemsType === "string" && schemaItemsFormat === "binary")
      ? true
      : false
  if (schemaItemsType && schemaItemsFormat) {
    ArrayItemsComponent = getComponent(
      `JsonSchema_${schemaItemsType}_${schemaItemsFormat}`,
    )
  } else if (
    schemaItemsType === "boolean" ||
    schemaItemsType === "array" ||
    schemaItemsType === "object"
  ) {
    ArrayItemsComponent = getComponent(`JsonSchema_${schemaItemsType}`)
  }
  // if ArrayItemsComponent not assigned or does not exist,
  // use default schemaItemsType === "string" & JsonSchemaArrayItemText component
  if (!ArrayItemsComponent && !isArrayItemFile) {
    isArrayItemText = true
  }

  if (schemaItemsEnum) {
    const comboboxValue =
      value instanceof List ? (value as any).toArray() : Array.from(value)
    return (
      <QCombobox
        className="q-swagger-input"
        clearable={!required}
        disableOptionToggle={required}
        disabled={disabled}
        error={errors.length ? errors[0] : ""}
        multiple
        onChange={(event, value) => onEnumChange(value)}
        options={schemaItemsEnum.toArray()}
        value={comboboxValue}
      />
    )
  }

  return (
    <div className="json-schema-array">
      {shouldRenderValue
        ? value.map((item: any, i: number) => {
            const itemErrors = fromJS([
              ...errors
                .filter((err: any) => err.index === i)
                .map((e: any) => e.error),
            ])
            return (
              <div key={i} className="json-schema-form-item">
                {isArrayItemFile ? (
                  <JsonSchemaArrayItemFile
                    {...props}
                    disabled={disabled}
                    errors={itemErrors}
                    onChange={(val: any) => onItemChange(val, i)}
                    value={item}
                  />
                ) : isArrayItemText ? (
                  <JsonSchemaArrayItemText
                    {...props}
                    disabled={disabled}
                    errors={itemErrors}
                    onChange={(val: any) => onItemChange(val, i)}
                    value={item}
                  />
                ) : (
                  <ArrayItemsComponent
                    {...props}
                    disabled={disabled}
                    errors={itemErrors}
                    fn={fn}
                    getComponent={getComponent}
                    onChange={(val: any) => onItemChange(val, i)}
                    schema={schemaItemsSchema}
                    value={item}
                  />
                )}
                {!disabled ? (
                  <QIconButton
                    aria-label={
                      needsRemoveError?.length
                        ? needsRemoveError[0]
                        : "Remove Option"
                    }
                    icon={MinusIcon}
                    onClick={() => removeItem(i)}
                    variant="outline"
                  />
                ) : null}
              </div>
            )
          })
        : null}
      {!disabled ? (
        <QButton
          aria-label={arrayErrors.length ? arrayErrors[0] : ""}
          className="qui-json-schema-array-add-btn"
          color={arrayErrors.length ? "negative" : "neutral"}
          endIcon={PlusIcon}
          onClick={addItem}
          variant="fill"
        >
          Add {schemaItemsType ? `${schemaItemsType} ` : ""}item
        </QButton>
      ) : null}
    </div>
  )
}
