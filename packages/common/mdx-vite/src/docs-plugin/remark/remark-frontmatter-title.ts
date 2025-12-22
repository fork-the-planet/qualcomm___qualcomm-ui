// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Heading, Parent, Root} from "mdast"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

interface MdxTextExpression {
  type: "mdxTextExpression"
  value: string
}

function isMdxTextExpression(node: unknown): node is MdxTextExpression {
  const n = node as {type?: string; value?: unknown}
  return n.type === "mdxTextExpression" && typeof n.value === "string"
}

/**
 * Apply data-page-title attribute to heading elements containing
 * `{frontmatter.title}`. We use this attribute to prevent the main title from
 * rendering twice, as it's organized into a separate page heading for layout
 * purposes.
 */
export const remarkFrontmatterTitle: Plugin<[], Root> = () => {
  return (tree) => {
    visit(
      tree,
      "heading",
      (node: Heading, index, parent: Parent | undefined) => {
        if (index === undefined || !parent) {
          return
        }

        const hasFrontmatterTitle = node.children.some(
          (child) =>
            isMdxTextExpression(child) &&
            child.value.trim() === "frontmatter.title",
        )

        if (!hasFrontmatterTitle) {
          return
        }

        const wrappedNode = {
          attributes: [
            {
              name: "data-page-title",
              type: "mdxJsxAttribute",
              value: "",
            },
          ],
          children: node.children,
          name: `h${node.depth}`,
          type: "mdxJsxFlowElement",
        }

        parent.children[index] = wrappedNode as (typeof parent.children)[number]
      },
    )
  }
}
