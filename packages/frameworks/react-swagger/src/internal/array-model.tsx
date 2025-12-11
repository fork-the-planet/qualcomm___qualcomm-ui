// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {JsonModelViewer} from "./json-model-viewer"
import type {GetComponent, Schema} from "./types"
import {useThemeContext} from "./use-theme-context"

ArrayModel.displayName = "ArrayModel"

export interface ArrayModelProps {
  depth?: number
  displayName?: string
  expandDepth?: number
  expanded?: boolean
  getComponent: GetComponent
  includeReadOnly?: boolean
  includeWriteOnly?: boolean
  name?: string
  onToggle?: (modelName: string, expanded: boolean) => void
  required?: boolean
  schema: Schema
}

export function ArrayModel(props: ArrayModelProps): ReactNode {
  const {schema} = props

  const renderLink = props.getComponent("RenderLink")

  const title: any = schema.get("title") || props.displayName || props.name

  const titleEl = title ? (
    <button
      className="model-box-control"
      onClick={() => props.onToggle?.(props.name!, !props.expanded)}
    >
      <span className="model-title__text">{title}</span>
    </button>
  ) : null

  const json = schema.toJS()

  const theme = useThemeContext()

  return (
    <div className="array-model">
      {titleEl}
      <JsonModelViewer
        displayDataTypes={false}
        displaySize={false}
        groupArraysAfterLength={100}
        highlightUpdates
        indentWidth={2}
        renderLink={renderLink}
        rootName={false}
        theme={theme}
        value={json}
      />
    </div>
  )
}
