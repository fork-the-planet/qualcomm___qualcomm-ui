// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type ReactNode,
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react"

import {Accordion} from "@qualcomm-ui/react/accordion"

ModelCollapse.displayName = "ModelCollapse"

export interface ModelCollapseProps {
  activeInHash?: boolean
  children: any
  classes: string
  collapsedContent: any
  expanded: boolean
  hideSelfOnExpand: boolean
  layoutActions: Record<string, any>
  layoutSelectors: Record<string, any>
  modelId?: string
  modelName: string
  onToggle?: (modelName: string, expanded: boolean) => void
  specPath: any
  title: ReactNode
}

export function ModelCollapse({
  children,
  classes,
  collapsedContent = "{...}",
  expanded: expandedProp = true,
  hideSelfOnExpand = false,
  modelId,
  modelName,
  onToggle,
  title,
}: ModelCollapseProps): ReactNode {
  const [expanded, setExpanded] = useState(expandedProp)

  const mounted = useRef(false)

  useEffect(() => {
    setExpanded(expandedProp)
  }, [expandedProp])

  const toggleCollapsed = useCallback(() => {
    onToggle?.(modelName, !expanded)
    setExpanded((prevState) => !prevState)
  }, [expanded, modelName, onToggle])

  const toggle = useEffectEvent(() => {
    toggleCollapsed()
  })

  useEffect(() => {
    if (
      !mounted.current &&
      window.location.hash &&
      modelId &&
      window.location.hash === `#${modelId}`
    ) {
      const anchor = document.getElementById(modelId)
      if (anchor) {
        anchor.scrollIntoView()
        if (!expanded) {
          toggle()
        }
      }
    }
    // Only scroll after first mounting the component.
    // We do this because the swagger component is mounted after the page loads.
    mounted.current = true
  }, [modelId, modelName, onToggle, expanded, toggleCollapsed])

  const ensureExpanded = useEffectEvent(() => {
    if (modelId && window.location.hash === `#${modelId}` && !expanded) {
      toggleCollapsed()
    }
  })

  useEffect(() => {
    function onStateChange() {
      ensureExpanded()
    }
    window.navigation?.addEventListener("navigatesuccess", onStateChange)
    return () => {
      window.navigation?.removeEventListener("navigatesuccess", onStateChange)
    }
  }, [])

  if (expanded && hideSelfOnExpand) {
    return <span className={classes || ""}>{children}</span>
  }

  return (
    <span>
      <Accordion.Root
        onValueChange={toggleCollapsed}
        value={expanded ? ["item"] : []}
      >
        <Accordion.Item text={title} value="item">
          {expanded ? children : <span>{collapsedContent}</span>}
        </Accordion.Item>
      </Accordion.Root>
    </span>
  )
}
