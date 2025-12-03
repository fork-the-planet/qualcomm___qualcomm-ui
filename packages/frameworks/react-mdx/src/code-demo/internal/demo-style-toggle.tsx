// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

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
      transformTailwindClasses: !prevState.transformTailwindClasses,
    }))
  }

  const transformTailwindClasses = demoSettings?.transformTailwindClasses

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
              transformTailwindClasses ? (
                <CssLogo style={{"--icon-size": "16px"} as CSSProperties} />
              ) : (
                <TailwindLogo
                  style={{"--icon-size": "16px"} as CSSProperties}
                />
              )
            }
            onClick={toggleStyleMode}
            size="sm"
            variant="ghost"
          />
        }
      >
        {transformTailwindClasses
          ? "Switch to tailwind styles"
          : "Switch to inline styles"}
      </Tooltip>
    </div>
  )
}
