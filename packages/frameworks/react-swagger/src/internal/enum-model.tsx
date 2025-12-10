import type {ReactNode} from "react"

import {JsonModelViewer, type JsonViewerKeyRenderer} from "./json-model-viewer"
import type {GetComponent} from "./types"
import {useThemeContext} from "./use-theme-context"

EnumModel.displayName = "EnumModel"

export interface EnumModelProps {
  getComponent: GetComponent
  value: any
}

const KeyRenderer: JsonViewerKeyRenderer = () => null
KeyRenderer.when = () => true

export function EnumModel({getComponent, value}: EnumModelProps): ReactNode {
  const renderLink = getComponent("RenderLink")

  const theme = useThemeContext()

  return (
    <JsonModelViewer
      defaultInspectDepth={25}
      displayDataTypes={false}
      displayKeyIndicator={false}
      displaySize={false}
      groupArraysAfterLength={100}
      indentWidth={2}
      keyRenderer={KeyRenderer}
      renderLink={renderLink}
      rootName={false}
      theme={theme}
      value={value.toJSON()}
    />
  )
}
