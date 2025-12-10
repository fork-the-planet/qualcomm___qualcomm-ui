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
