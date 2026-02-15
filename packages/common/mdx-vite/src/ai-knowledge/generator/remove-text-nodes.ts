import type {Text} from "mdast"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

import {isSpoilerBlock, isStepBlock} from "../../docs-plugin"

export const removeTextNodes: Plugin = () => {
  return (tree, _file, done) => {
    visit(tree, "text", (node: Text) => {
      const value = node.value?.trim?.()
      if (value && (isStepBlock(value) || isSpoilerBlock(value))) {
        Object.assign(node, {
          value: ``,
        })
      }
    })
    done()
  }
}
