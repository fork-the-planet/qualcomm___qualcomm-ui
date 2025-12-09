import {ReactNode} from "react"

import {ChevronUpIcon} from "lucide-react"

import {QButton} from "@qui/react"

import {JsonModelViewer} from "./json-model-viewer"
import {GetComponent, Schema} from "./types"
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

  if (!schema) {
    return null
  }

  schema.mapEntries((entry: any) => {
    return entry
  })

  const json = schema.toJS()
  const title = (schema.get("title") as string) || displayName || name

  const titleEl = title ? (
    <QButton
      className="object-model-expand-button"
      endIcon={ChevronUpIcon}
      onClick={() => props.onToggle?.(props.name!, !props.expanded)}
      variant={props.activeInHash ? "outline" : "ghost"}
    >
      {isRef && schema.get("$$ref") && (
        <span className="model-hint">{schema.get("$$ref") as string}</span>
      )}
      <span className="model-title__text">{title}</span>
    </QButton>
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
