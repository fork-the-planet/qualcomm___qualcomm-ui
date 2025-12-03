// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type ComponentPropsWithRef,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
// eslint-disable-next-line no-restricted-imports
import * as React from "react"

import {ChevronsLeftRight} from "lucide-react"

import type {ReactDemoData, SourceCodeData} from "@qualcomm-ui/mdx-common"
import {Button} from "@qualcomm-ui/react/button"
import type {ColorScheme} from "@qualcomm-ui/react/qds-theme"
import {Tab, Tabs} from "@qualcomm-ui/react/tabs"
import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"
import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"
import {CopyToClipboardIconButton} from "@qualcomm-ui/react-mdx/copy-to-clipboard"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {getDefaultSourceCode} from "./code-demo.utils"
import {DemoStyleToggle} from "./internal"

export interface ReactDemoProps extends ComponentPropsWithRef<"div"> {
  /**
   * Optional child element, rendered above the component demo.
   */
  children?: ReactNode

  colorScheme?: ColorScheme

  component: () => ReactNode

  /**
   * The default source code index to render.
   */
  defaultSourceIndex?: number

  /**
   * Demo getter function provided by the vite plugin.
   */
  demo: ReactDemoData | null

  /**
   * Whether the source code is viewable. If false, the source code and filename
   * tabs will not render.
   */
  expandable?: boolean

  /**
   * Whether the source code is initially expanded.
   */
  expanded?: boolean

  /**
   * The name of the primary demo. This is the PascalCase name of the demo file
   * without its extension.
   *
   * @example
   * ```tsx
   * // demos/my-demo-file.tsx
   * export default function Demo() {
   *   // ...
   * }
   *
   * // <QdsReactDemo name="MyDemoFile" />
   * ```
   *
   * TODO: link to docs
   */
  name: string

  /**
   * Props applied to the element that wraps the component demo.
   */
  wrapperProps?: ComponentPropsWithRef<"div">
}

export function ReactDemo({
  children,
  colorScheme,
  component: Component,
  defaultSourceIndex: _defaultSourceIndex = 0,
  demo: demoProp,
  expandable = true,
  expanded: expandedProp = false,
  name,
  wrapperProps = {},
  ...props
}: ReactDemoProps): ReactNode {
  const demo: ReactDemoData = demoProp || {
    demoName: "",
    fileName: "",
    filePath: "",
    imports: [],
    pageId: "",
    sourceCode: [],
  }

  const htmlWrapperRef = useRef<HTMLDivElement>(null)

  const [activeTab, setActiveTab] = useState<string>(demo?.fileName || "")

  const {demoSettings, demoState, setDemoSettings, updateDemoState} =
    useMdxDocsContext()

  const state = useMemo(() => {
    return demoState[demo.pageId] || {}
  }, [demo.pageId, demoState])

  const [expanded, setExpanded] = useState(
    state?.[name]?.expanded || expandedProp,
  )

  useEffect(() => {
    if (!demo?.fileName) {
      console.warn(
        "ReactDemo: no fileName found for demo",
        Component?.name || "",
      )
    }
  }, [Component, demo?.fileName])

  /**
   * If the activeTab is a relative file, and it's removed from the demo scope
   * (i.e., no longer imported by the demo file), reset the active tab.
   */
  useSafeLayoutEffect(() => {
    if (demo.sourceCode.every((item) => item.fileName !== activeTab)) {
      setActiveTab(demo.sourceCode[0]?.fileName)
    }
  }, [demo.sourceCode])

  useSafeLayoutEffect(() => {
    if (demo?.fileName && !activeTab) {
      setActiveTab(demo?.fileName)
    }
  }, [activeTab, demo?.fileName])

  const toggleCollapsed = () => {
    queueMicrotask(() => {
      updateDemoState(demo.pageId, name, {expanded: !expanded})
    })
    setExpanded((prevState) => {
      return !prevState
    })
  }

  const fileNames = demo.sourceCode?.map?.((item) => item.fileName) ?? []

  const activeTabSourceCode: SourceCodeData =
    (demo.sourceCode ?? []).find((item) => item.fileName === activeTab) ??
    getDefaultSourceCode()

  const hasInline = !!activeTabSourceCode.highlightedInline
  const activeHighlightedCode =
    hasInline && demoSettings?.styleMode === "inline"
      ? activeTabSourceCode.highlightedInline
      : activeTabSourceCode.highlighted
  const hasPreview = !!activeHighlightedCode?.preview
  const scheme = colorScheme || "dark"

  const mergedProps = mergeProps(
    {
      className: "qui-docs-demo-container__root",
      "data-has-preview": booleanDataAttr(hasPreview),
      "data-state": expanded ? "expanded" : "collapsed",
    },
    props,
  )

  const getCopyableCode = () => {
    const ref = htmlWrapperRef.current
    if (ref) {
      const preElement = ref.querySelector("pre")
      if (preElement) {
        const dataCode = preElement.getAttribute("data-code")
        const dataPreview = preElement.getAttribute("data-preview")
        if (dataCode) {
          return expanded ? dataCode : dataPreview || dataCode
        }
      }
    }
    return (
      (expanded
        ? activeTabSourceCode.raw?.full
        : activeTabSourceCode.raw?.preview || activeTabSourceCode.raw?.full) ||
      ""
    )
  }

  const getHighlightedCode = () => {
    if (hasPreview) {
      return expanded
        ? activeHighlightedCode.full
        : activeHighlightedCode.preview!
    }
    return activeHighlightedCode!.full
  }

  return (
    <div {...mergedProps}>
      {children}

      {!expandable ? (
        <Component />
      ) : (
        <>
          <div
            {...mergeProps(
              {className: "qui-demo-runner__wrapper"},
              wrapperProps,
            )}
            data-theme={scheme}
          >
            <Component />
          </div>
          <div className="qui-demo-runner__tabs">
            <div
              className="qui-demo-runner__action-bar"
              data-state={expanded || hasPreview ? "open" : "closed"}
            >
              {fileNames.length > 1 ? (
                <Tabs.Root
                  onValueChange={(value) => {
                    setActiveTab(value)
                    if (!expanded) {
                      setExpanded(true)
                    }
                  }}
                  value={expanded || hasPreview ? activeTab : null}
                >
                  <Tabs.List>
                    <Tabs.Indicator />
                    {fileNames.map((fileName) => {
                      return (
                        <Tab.Root key={fileName} value={fileName}>
                          <Tab.Button
                            onClick={() => {
                              if (!expanded) {
                                setExpanded(true)
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
                <Button
                  data-brand="qualcomm"
                  emphasis="primary"
                  endIcon={ChevronsLeftRight}
                  onClick={toggleCollapsed}
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
                <CopyToClipboardIconButton
                  density="default"
                  size="sm"
                  valueOrFn={getCopyableCode}
                />
              </div>
            </div>

            <div
              ref={htmlWrapperRef}
              className="qui-docs-highlighter__root"
              dangerouslySetInnerHTML={{__html: getHighlightedCode()}}
              data-hidden={booleanDataAttr(!expanded && !hasPreview)}
            ></div>
          </div>
        </>
      )}
    </div>
  )
}
