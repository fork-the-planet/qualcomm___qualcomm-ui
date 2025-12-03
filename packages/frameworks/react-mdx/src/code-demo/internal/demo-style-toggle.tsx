import type {ComponentPropsWithRef, CSSProperties, ReactElement} from "react"

import {IconButton} from "@qualcomm-ui/react/button"
import {Tooltip} from "@qualcomm-ui/react/tooltip"
import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {CssLogo} from "./css-logo"
import {TailwindLogo} from "./tailwind-logo"

export interface DemoStyleToggleProps extends ComponentPropsWithRef<"div"> {}

export function DemoStyleToggle(props: DemoStyleToggleProps): ReactElement {
  const {demoSettings, setDemoSettings} = useMdxDocsContext()

  const toggleStyleMode = () => {
    setDemoSettings?.((prevState) => ({
      ...prevState,
      styleMode: prevState.styleMode === "default" ? "inline" : "default",
    }))
  }

  const mode = demoSettings?.styleMode ?? "default"
  const styleMode = mode === "default" ? "Default" : "Inline"

  const mergedProps = mergeProps(
    {className: "qui-demo-runner__style-toggle"},
    props,
  )

  return (
    <div {...mergedProps}>
      <Tooltip
        trigger={
          <IconButton
            emphasis="primary"
            icon={
              mode === "default" ? (
                <TailwindLogo
                  style={{"--icon-size": "16px"} as CSSProperties}
                />
              ) : (
                <CssLogo style={{"--icon-size": "16px"} as CSSProperties} />
              )
            }
            onClick={toggleStyleMode}
            size="sm"
            variant="ghost"
          >
            {styleMode}
          </IconButton>
        }
      >
        {mode === "default"
          ? "Switch to inline styles"
          : "Switch to tailwind styles"}
      </Tooltip>
    </div>
  )
}
