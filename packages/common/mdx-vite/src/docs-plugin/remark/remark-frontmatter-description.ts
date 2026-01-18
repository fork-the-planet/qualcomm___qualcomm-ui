// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Parent, Root} from "mdast"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

interface MdxFlowExpression {
  type: "mdxFlowExpression"
  value: string
}

/**
 * Wraps standalone `{frontmatter.description}` expressions in a
 * `<p class="mdx">` element for styling purposes.
 */
export const remarkFrontmatterDescription: Plugin<[], Root> = () => {
  return (tree) => {
    visit(
      tree,
      "mdxFlowExpression",
      (
        node: MdxFlowExpression,
        index: number | undefined,
        parent: Parent | undefined,
      ) => {
        if (
          node.value.trim() !== "frontmatter.description" ||
          index === undefined ||
          !parent
        ) {
          return
        }

        const wrappedNode = {
          attributes: [
            {
              name: "className",
              type: "mdxJsxAttribute",
              value: "mdx qui-docs__page-description",
            },
          ],
          children: [node],
          name: "p",
          type: "mdxJsxFlowElement",
        }

        parent.children[index] = wrappedNode as any
      },
    )
  }
}
