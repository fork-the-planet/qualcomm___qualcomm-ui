import type {Text} from "mdast"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

import {isStepBlock} from "../../docs-plugin"

export const removeStepNodes: Plugin = () => {
  return (tree, _file, done) => {
    visit(tree, "text", (node: Text) => {
      if (node.value && isStepBlock(node.value.trim())) {
        Object.assign(node, {
          value: ``,
        })
      }
    })
    done()
  }
}
