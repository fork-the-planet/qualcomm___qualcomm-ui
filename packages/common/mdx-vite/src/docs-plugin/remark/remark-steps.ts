// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BlockContent, Root} from "mdast"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

/**
 * Transforms `:::steps` blocks into a styled `<div>` wrapper.
 *
 * @example
 * ```
 * :::steps
 *
 * ## Step 1
 *
 * Content for step 1.
 *
 * ## Step 2
 *
 * Content for step 2.
 *
 * :::
 * ```
 *
 * result:
 *
 * ```jsx
 * <div className="qui-docs__steps">
 *   <h2>Step 1</h2>
 *   <p>Content for step 1.</p>
 *   <h2>Step 2</h2>
 *   <p>Content for step 2.</p>
 * </div>
 * ```
 */
export const remarkSteps: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index === undefined) {
        return
      }

      const firstChild = node.children[0]
      if (firstChild?.type !== "text") {
        return
      }

      const match = firstChild.value.match(/^:::\s*steps\s*$/)
      if (!match) {
        return
      }

      let endIndex = index + 1
      const contentNodes: BlockContent[] = []

      while (endIndex < parent.children.length) {
        const child = parent.children[endIndex]

        if (child.type === "paragraph") {
          const firstText = child.children[0]
          if (firstText?.type === "text" && firstText.value.trim() === ":::") {
            break
          }
        }

        contentNodes.push(child as BlockContent)
        endIndex++
      }

      if (endIndex >= parent.children.length) {
        return
      }

      const stepsNode: BlockContent = {
        attributes: [],
        children: contentNodes,
        name: "HeadingSteps",
        type: "mdxJsxFlowElement",
      }

      parent.children.splice(index, endIndex - index + 1, stepsNode)
    })
  }
}
