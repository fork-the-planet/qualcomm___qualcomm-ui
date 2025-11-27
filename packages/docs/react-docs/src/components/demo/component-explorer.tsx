import type {ReactNode} from "react"

import {getDemo} from "virtual:qui-demo-scope/auto"

import {useQdsThemeContext} from "@qualcomm-ui/react/qds-theme"
import {
  ComponentExplorerBase,
  type ComponentExplorerBaseProps,
} from "@qualcomm-ui/react-mdx/component-explorer"
import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"

interface ComponentExplorerProps
  extends Omit<ComponentExplorerBaseProps, "children"> {
  component: () => ReactNode
  name: string
}

export function ComponentExplorer({
  component: Component,
  name,
  ...props
}: ComponentExplorerProps): ReactNode {
  const [theme] = useTheme()
  const {brand} = useQdsThemeContext()

  const demo = getDemo(name)

  if (!demo) {
    return (
      <div className="qui-component-explorer-error">
        <p>Demo not found: {name}</p>
      </div>
    )
  }

  const scheme = theme === Theme.LIGHT ? "light" : "dark"

  return (
    <ComponentExplorerBase {...props}>
      <div data-brand={brand || "qualcomm"} data-theme={scheme}>
        <Component />
      </div>
    </ComponentExplorerBase>
  )
}
