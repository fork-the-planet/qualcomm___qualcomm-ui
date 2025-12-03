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

import type {ReactDemoData} from "@qualcomm-ui/mdx-common"
import type {ColorScheme} from "@qualcomm-ui/react/qds-theme"
import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"
import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"
import {CopyToClipboardIconButton} from "@qualcomm-ui/react-mdx/copy-to-clipboard"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {DemoCodePanel, useDemoSourceCode} from "./internal"

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

  const {demoState, updateDemoState} = useMdxDocsContext()

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

  const scheme = colorScheme || "dark"

  const {
    activeTabSourceCode,
    fileNames,
    getHighlightedCode,
    hasInlineStyles,
    hasPreview,
  } = useDemoSourceCode({
    activeTab,
    expanded,
    sourceCode: demo.sourceCode,
  })

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
        ? activeTabSourceCode?.raw?.full
        : activeTabSourceCode?.raw?.preview ||
          activeTabSourceCode?.raw?.full) || ""
    )
  }

  const handleExpandedChange = (newExpanded: boolean) => {
    queueMicrotask(() => {
      updateDemoState(demo.pageId, name, {expanded: newExpanded})
    })
    setExpanded(newExpanded)
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
          <DemoCodePanel
            activeTab={activeTab}
            copyButton={
              <CopyToClipboardIconButton
                density="default"
                size="sm"
                valueOrFn={getCopyableCode}
              />
            }
            expanded={expanded}
            fileNames={fileNames}
            getHighlightedCode={getHighlightedCode}
            hasInlineStyles={hasInlineStyles}
            hasPreview={hasPreview}
            highlighterRef={htmlWrapperRef}
            onExpandedChange={handleExpandedChange}
            onTabChange={setActiveTab}
            tabsValue={expanded || hasPreview ? activeTab : null}
          />
        </>
      )}
    </div>
  )
}
