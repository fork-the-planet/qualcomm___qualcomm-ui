// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Parent, Root, Text} from "mdast"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

import type {PageFrontmatter} from "@qualcomm-ui/mdx-common"

interface MdxExpression {
  type: "mdxFlowExpression" | "mdxTextExpression"
  value: string
}

const FRONTMATTER_PATTERN = /^\s*frontmatter\.(\w+)\s*$/

function isMdxExpression(node: unknown): node is MdxExpression {
  const n = node as {type?: string; value?: unknown}
  return (
    (n.type === "mdxFlowExpression" || n.type === "mdxTextExpression") &&
    typeof n.value === "string"
  )
}

/**
 * Replaces `{frontmatter.*}` expressions with their actual values from the
 * frontmatter object. This is safer than string replacement as it operates
 * on the AST and won't accidentally match text in code blocks or examples.
 */
export const remarkFrontmatterInterpolation: Plugin<[PageFrontmatter], Root> = (
  frontmatter,
) => {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (!isMdxExpression(node) || index === undefined || !parent) {
        return
      }

      const match = node.value.match(FRONTMATTER_PATTERN)
      if (!match) {
        return
      }

      const key = match[1] as keyof PageFrontmatter
      const value = frontmatter[key]

      if (typeof value === "string" || typeof value === "number") {
        const textNode: Text = {
          type: "text",
          value: String(value),
        }
        ;(parent as Parent).children[index] = textNode
      }
    })
  }
}
