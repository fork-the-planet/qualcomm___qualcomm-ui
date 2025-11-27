import {useState} from "react"

import {getAngularDemoInfo} from "virtual:angular-demo-registry"

import type {AngularDemoInfo} from "@qualcomm-ui/mdx-common"
import {useQdsThemeContext} from "@qualcomm-ui/react/qds-theme"
import {
  ComponentExplorerBase,
  type ComponentExplorerBaseProps,
} from "@qualcomm-ui/react-mdx/component-explorer"
import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"

import {QdsDemo} from "./qds-demo"

interface ComponentExplorerProps
  extends Omit<ComponentExplorerBaseProps, "children"> {
  name: string
}

export function ComponentExplorer({name, ...props}: ComponentExplorerProps) {
  const [demoInfo] = useState<AngularDemoInfo | null>(getAngularDemoInfo(name))
  const {brand} = useQdsThemeContext()
  const [theme] = useTheme()
  const scheme = theme === Theme.LIGHT ? "light" : "dark"

  if (!demoInfo) {
    return (
      <div className="qui-component-explorer-error">
        <p>Demo not found: {name}</p>
      </div>
    )
  }

  return (
    <ComponentExplorerBase {...props}>
      <div data-brand={brand || "qualcomm"} data-theme={scheme}>
        <QdsDemo name={name} withoutUI />
      </div>
    </ComponentExplorerBase>
  )
}
