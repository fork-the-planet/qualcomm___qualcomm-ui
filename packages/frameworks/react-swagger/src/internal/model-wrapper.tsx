import type {ReactNode} from "react"

import type {GetComponent} from "./types"

interface Props {
  displayName?: string
  expandDepth?: number
  fullPath: any[]
  getComponent: GetComponent
  getConfigs: () => any
  includeReadOnly?: boolean
  includeWriteOnly?: boolean
  layoutActions?: any
  layoutSelectors: any
  name?: string
  schema: any
  specPath: any
  specSelectors: any
}

export function ModelWrapper(props: Props): ReactNode {
  const {
    expandDepth,
    fullPath,
    getComponent,
    getConfigs,
    layoutActions,
    layoutSelectors,
  } = props

  const onToggle = (name: string, isShown: boolean) => {
    // If this prop is present, we'll have deepLinking for it
    if (layoutActions) {
      layoutActions.show(fullPath, isShown)
    }
  }

  const Model = getComponent("Model")

  let expanded
  if (layoutSelectors) {
    // If this is prop is present, we'll have deepLinking for it
    expanded = layoutSelectors.isShown(fullPath)
  }

  return (
    <div className="model-box">
      <Model
        {...props}
        depth={1}
        expandDepth={expandDepth || 0}
        expanded={expanded}
        getConfigs={getConfigs}
        onToggle={onToggle}
      />
    </div>
  )
}
