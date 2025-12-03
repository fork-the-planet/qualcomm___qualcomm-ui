// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode, RefObject} from "react"

import {ChevronsLeftRight} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"
import {Tab, Tabs} from "@qualcomm-ui/react/tabs"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"

import {DemoStyleToggle} from "./demo-style-toggle"

export interface DemoCodePanelProps {
  /**
   * Additional actions to render before the expand/collapse button.
   */
  actionsStart?: ReactNode
  activeTab: string
  /**
   * Copy button element - allows different copy button implementations.
   */
  copyButton: ReactNode
  expanded: boolean
  fileNames: string[]
  getHighlightedCode: () => string
  hasPreview: boolean
  /**
   * Ref for the highlighted code container (used by React demo for DOM-based
   * code copying).
   */
  highlighterRef?: RefObject<HTMLDivElement | null>
  onExpandedChange: (expanded: boolean) => void
  onTabChange: (tab: string) => void
  /**
   * Whether to suppress hydration warnings (needed for Angular SSR).
   */
  suppressHydrationWarning?: boolean
  /**
   * Value for the tabs - allows controlling when tabs appear selected.
   */
  tabsValue?: string | null
}

export function DemoCodePanel({
  actionsStart,
  activeTab,
  copyButton,
  expanded,
  fileNames,
  getHighlightedCode,
  hasPreview,
  highlighterRef,
  onExpandedChange,
  onTabChange,
  suppressHydrationWarning,
  tabsValue,
}: DemoCodePanelProps): ReactNode {
  const effectiveTabsValue = tabsValue !== undefined ? tabsValue : activeTab

  return (
    <div className="qui-demo-runner__tabs">
      <div
        className="qui-demo-runner__action-bar"
        data-state={expanded || hasPreview ? "open" : "closed"}
      >
        {fileNames.length > 1 ? (
          <Tabs.Root
            onValueChange={(value) => {
              onTabChange(value)
              if (!expanded) {
                onExpandedChange(true)
              }
            }}
            value={effectiveTabsValue}
          >
            <Tabs.List>
              <Tabs.Indicator />
              {fileNames.map((fileName) => {
                return (
                  <Tab.Root key={fileName} value={fileName}>
                    <Tab.Button
                      onClick={() => {
                        if (!expanded) {
                          onExpandedChange(true)
                        }
                      }}
                    >
                      {fileName}
                    </Tab.Button>
                  </Tab.Root>
                )
              })}
            </Tabs.List>
          </Tabs.Root>
        ) : (
          <div />
        )}
        <div className="qui-demo-runner__actions">
          {actionsStart}
          <Button
            data-brand="qualcomm"
            emphasis="primary"
            endIcon={ChevronsLeftRight}
            onClick={() => onExpandedChange(!expanded)}
            size="sm"
            variant="ghost"
          >
            {hasPreview
              ? expanded
                ? "Collapse Code"
                : "Expand Code"
              : expanded
                ? "Hide Code"
                : "Show Code"}
          </Button>
          <DemoStyleToggle />
          {copyButton}
        </div>
      </div>

      {hasPreview || expanded ? (
        <div
          ref={highlighterRef}
          className="qui-docs-highlighter__root"
          dangerouslySetInnerHTML={{__html: getHighlightedCode()}}
          data-hidden={booleanDataAttr(!expanded && !hasPreview)}
          suppressHydrationWarning={suppressHydrationWarning}
        />
      ) : null}
    </div>
  )
}
