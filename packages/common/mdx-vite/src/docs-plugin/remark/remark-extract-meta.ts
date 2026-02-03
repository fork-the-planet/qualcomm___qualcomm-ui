// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Parent, Root} from "mdast"
import type {Plugin} from "unified"
import {SKIP, visit} from "unist-util-visit"

export type MetadataValue = Record<string, string | string[]>

/**
 * Parses a YAML-like value, handling arrays and strings.
 */
function parseValue(value: string): string | string[] {
  const trimmed = value.trim()

  // Handle array syntax: [item1, item2, item3]
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1)
    return inner
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return trimmed
}

/**
 * Parses the content of a meta block into key-value pairs.
 */
function parseMetaContent(content: string): MetadataValue {
  const result: MetadataValue = {}
  const lines = content.split("\n")

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed === ":::") {
      continue
    }

    const colonIndex = trimmed.indexOf(":")
    if (colonIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, colonIndex).trim()
    const value = trimmed.slice(colonIndex + 1).trim()

    if (key && value) {
      result[key] = parseValue(value)
    }
  }

  return result
}

/**
 * Extracts metadata from MDX files and removes it from the MDX content.
 *
 * @example
 * ```
 * ::: meta
 * component: NumberInput
 * keywords: [forms, input, data entry]
 * :::
 *
 * result: {keywords: ["forms", "input", "data entry"], component: "NumberInput"}
 * ```
 */
export const remarkExtractMeta: Plugin<[MetadataValue], Root> = (
  metadata = {},
) => {
  return (tree) => {
    const nodesToRemove: Array<{index: number; parent: Parent}> = []

    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index === undefined) {
        return
      }

      const firstChild = node.children[0]
      if (firstChild?.type !== "text") {
        return
      }

      const text = firstChild.value
      const openMatch = text.match(/^:::\s*meta\s*/)

      if (!openMatch) {
        return
      }

      // Check if the entire meta block is in this single paragraph
      // (common when markdown parser keeps it together)
      if (
        text.includes(":::") &&
        text.lastIndexOf(":::") > openMatch[0].length
      ) {
        // Extract content between opening ::: meta and closing :::
        const afterOpen = text.slice(openMatch[0].length)
        const closeIndex = afterOpen.lastIndexOf(":::")
        const content = afterOpen.slice(0, closeIndex)

        const parsed = parseMetaContent(content)
        Object.assign(metadata, parsed)

        nodesToRemove.push({index, parent})
        return SKIP
      }

      // Multi-paragraph case: collect text from multiple nodes
      // The meta block might span multiple text children
      let fullText = text
      for (let i = 1; i < node.children.length; i++) {
        const child = node.children[i]
        if (child.type === "text") {
          fullText += child.value
        }
      }

      // Check for closing ::: in the combined text
      const afterOpenFull = fullText.slice(openMatch[0].length)
      const closeIndexFull = afterOpenFull.lastIndexOf(":::")

      if (closeIndexFull !== -1) {
        const content = afterOpenFull.slice(0, closeIndexFull)
        const parsed = parseMetaContent(content)
        Object.assign(metadata, parsed)

        nodesToRemove.push({index, parent})
        return SKIP
      }
    })

    // Remove meta blocks from AST (in reverse order to preserve indices)
    for (let i = nodesToRemove.length - 1; i >= 0; i--) {
      const {index, parent} = nodesToRemove[i]
      parent.children.splice(index, 1)
    }
  }
}
