// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Root} from "mdast"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

export type MetadataValue = Record<string, string | string[]>

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
export const remarkExtractMetadata: Plugin<[MetadataValue], Root> = (
  metadata,
) => {
  return (tree) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index === undefined) {
        return
      }

      const firstChild = node.children[0]
      if (firstChild?.type !== "text") {
        return
      }

      const match = firstChild.value.match(/^:::\s*meta\s*(.*)$/)
      if (!match) {
        return
      }
    })
  }
}
