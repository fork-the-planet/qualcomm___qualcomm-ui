// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useEffect, useRef} from "react"

import {ChevronUpIcon} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"

import {JsonModelViewer} from "./json-model-viewer"
import type {GetComponent, Schema} from "./types"
import {useThemeContext} from "./use-theme-context"

ObjectModel.displayName = "ObjectModelOriginal"

export interface ObjectModelProps {
  activeInHash?: boolean
  depth?: number
  displayName?: string
  expandDepth?: number
  expanded?: boolean
  fn: any
  getComponent: GetComponent
  getConfigs: () => any
  includeReadOnly?: boolean
  includeWriteOnly?: boolean
  isRef?: boolean
  language?: string
  name?: string
  onToggle?: (name: string, expanded: boolean) => void
  schema: Schema
  specPath: Array<any>
  specSelectors: any
}

export function ObjectModel(props: ObjectModelProps): ReactNode {
  const {displayName, isRef, schema} = props

  const theme = useThemeContext()

  const mounted = useRef(false)

  useEffect(() => {
    if (!props.expanded && !mounted.current) {
      props.onToggle?.(props.name!, !props.expanded)
    }
    mounted.current = true
  }, [props])

  if (!schema) {
    return null
  }

  schema.mapEntries((entry: any) => {
    return entry
  })

  const json = schema.toJS()
  const title = (schema.get("title") as string) || displayName || name

  const titleEl = title ? (
    <Button
      className="object-model-expand-button"
      endIcon={ChevronUpIcon}
      onClick={() => props.onToggle?.(props.name!, !props.expanded)}
      variant="ghost"
    >
      {isRef && schema.get("$$ref") && (
        <span className="model-hint">{schema.get("$$ref") as string}</span>
      )}
      <span className="model-title__text">{title}</span>
    </Button>
  ) : null

  const renderLink = props.getComponent("RenderLink")

  return (
    <div className="object-model">
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
