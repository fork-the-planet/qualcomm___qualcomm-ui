// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useCallback, useEffect, useState} from "react"

import immutable from "immutable"
import {Edit2Icon, XIcon} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"

import {DocsCodeMirror} from "../code-mirror"

import type {GetComponent} from "./types"
import {useThemeContext} from "./use-theme-context"

ParamBody.displayName = "ParamBody"

export interface ParamBodyProps {
  consumes?: any
  consumesValue?: string
  fn: any
  getComponent: GetComponent
  isExecute?: boolean
  language?: string
  onChange?: (val: any, state: any) => void
  onChangeConsumes?: () => void
  param?: any
  pathMethod: string[]
  specSelectors: any
}

export function ParamBody({
  consumes: consumesProp,
  consumesValue: consumesValueProp,
  fn,
  getComponent,
  isExecute,
  language,
  onChange: onChangeProp,
  onChangeConsumes,
  param = immutable.fromJS({}),
  pathMethod,
  specSelectors,
}: ParamBodyProps): ReactNode {
  const [state, setState] = useState({isEditBox: false, value: ""})

  const onChange = useCallback(
    (value: any, {isEditBox, isXml}: any) => {
      setState({isEditBox, value})
      onChangeProp?.(value, isXml)
    },
    [onChangeProp],
  )

  const sample = useCallback(
    (xml?: string) => {
      const schema = fn.inferSchema(param.toJS())

      return fn.getSampleSchema(schema, xml, {
        includeWriteOnly: true,
      })
    },
    [fn, param],
  )

  const updateValues = useCallback(() => {
    const isXml = /xml/i.test(consumesValueProp!)
    const isJson = /json/i.test(consumesValueProp!)
    const paramValue = isXml ? param.get("value_xml") : param.get("value")

    if (paramValue !== undefined) {
      const val = !paramValue && isJson ? "{}" : paramValue
      setState((prevState) => ({...prevState, value: val}))
      onChange(val, {isEditBox: isExecute, isXml})
    } else {
      if (isXml) {
        onChange(sample("xml"), {isEditBox: isExecute, isXml})
      } else {
        onChange(sample(), {isEditBox: isExecute})
      }
    }
  }, [consumesValueProp, isExecute, onChange, param, sample])

  useEffect(() => {
    updateValues()
  }, [updateValues])

  const handleOnChange = (inputValue: string) => {
    const isXml = /xml/i.test(consumesValueProp!)
    onChange(inputValue, {isEditBox: state.isEditBox, isXml})
  }

  const toggleIsEditBox = () =>
    setState((state) => ({...state, isEditBox: !state.isEditBox}))

  const ContentType = getComponent("contentType")
  const consumesValue = specSelectors
    .contentTypeValues(pathMethod)
    .get("requestContentType")
  const consumes =
    consumesProp && consumesProp.size
      ? consumesProp
      : immutable.fromJS(["application/json"])

  const {isEditBox, value} = state

  const regionId = createHtmlReadyId(
    `${pathMethod[1]}${pathMethod[0]}_parameters`,
  )
  const controlId = `${regionId}_select`

  const theme = useThemeContext()

  return (
    <div
      className="body-param"
      data-param-in={param.get("in")}
      data-param-name={param.get("name")}
    >
      <DocsCodeMirror
        copyable
        editable={isEditBox}
        language={language || "json"}
        onChange={handleOnChange}
        theme={theme}
        value={value}
      />

      <div className="body-param-options">
        {!isExecute ? null : (
          <div className="body-param-edit">
            {isEditBox ? (
              <Button
                emphasis="danger"
                endIcon={XIcon}
                onClick={toggleIsEditBox}
                variant="outline"
              >
                Cancel
              </Button>
            ) : (
              <Button
                emphasis="primary"
                endIcon={Edit2Icon}
                onClick={toggleIsEditBox}
                variant="fill"
              >
                Edit
              </Button>
            )}
          </div>
        )}

        <ContentType
          contentTypes={consumes}
          controlId={controlId}
          label="Parameter content type"
          onChange={onChangeConsumes}
          value={consumesValue}
        />
      </div>
    </div>
  )
}

function createHtmlReadyId(id: string, replacement = "_") {
  return id.replace(/[^\w-]/g, replacement)
}
