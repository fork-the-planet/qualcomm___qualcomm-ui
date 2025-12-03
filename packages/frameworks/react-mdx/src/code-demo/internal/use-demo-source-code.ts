// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useMemo} from "react"

import type {SourceCode, SourceCodeData} from "@qualcomm-ui/mdx-common"
import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"

export interface UseDemoSourceCodeOptions {
  activeTab: string
  expanded: boolean
  sourceCode: SourceCodeData[]
}

export interface UseDemoSourceCodeResult {
  activeHighlightedCode: SourceCode | undefined
  activeTabSourceCode: SourceCodeData | undefined
  fileNames: string[]
  filteredSourceCode: SourceCodeData[]
  getHighlightedCode: () => string
  hasInlineStyles: boolean | undefined
  hasPreview: boolean | undefined
  isInlineMode: boolean | undefined
}

const defaultSourceCode: SourceCodeData = {
  fileName: "",
  highlighted: {full: ""},
  type: "file",
}

export function useDemoSourceCode({
  activeTab,
  expanded,
  sourceCode,
}: UseDemoSourceCodeOptions): UseDemoSourceCodeResult {
  const {demoSettings} = useMdxDocsContext()

  const isInlineMode = demoSettings?.transformTailwindClasses

  // Only show residual CSS tab when in inline mode
  const filteredSourceCode = useMemo(
    () =>
      isInlineMode
        ? sourceCode
        : (sourceCode ?? []).filter((item) => item.type !== "residual-css"),
    [sourceCode, isInlineMode],
  )

  const fileNames = useMemo(
    () => filteredSourceCode?.map((item) => item.fileName) ?? [],
    [filteredSourceCode],
  )

  const activeTabSourceCode: SourceCodeData | undefined = useMemo(
    () =>
      filteredSourceCode?.find((item) => item.fileName === activeTab) ||
      filteredSourceCode?.[0] ||
      defaultSourceCode,
    [activeTab, filteredSourceCode],
  )

  const hasInline =
    !!activeTabSourceCode?.highlightedInline ||
    activeTabSourceCode?.type === "residual-css"
  const activeHighlightedCode = useMemo(
    () =>
      isInlineMode && hasInline
        ? activeTabSourceCode?.highlightedInline
        : activeTabSourceCode?.highlighted,
    [isInlineMode, hasInline, activeTabSourceCode],
  )

  const hasPreview = useMemo(
    () => !!activeHighlightedCode?.preview,
    [activeHighlightedCode],
  )

  const getHighlightedCode = useMemo(() => {
    return () => {
      if (!activeHighlightedCode) {
        return ""
      }
      if (hasPreview) {
        return expanded
          ? activeHighlightedCode.full
          : activeHighlightedCode.preview || ""
      }
      return activeHighlightedCode.full
    }
  }, [activeHighlightedCode, expanded, hasPreview])

  return {
    activeHighlightedCode,
    activeTabSourceCode,
    fileNames,
    filteredSourceCode,
    getHighlightedCode,
    hasInlineStyles: hasInline,
    hasPreview,
    isInlineMode,
  }
}
