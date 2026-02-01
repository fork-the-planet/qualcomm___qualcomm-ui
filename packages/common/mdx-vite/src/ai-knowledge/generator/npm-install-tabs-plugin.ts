import type {MdxJsxAttribute, MdxJsxFlowElement} from "mdast-util-mdx-jsx"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

import {extractNamesFromAttribute} from "../../docs-plugin/internal/services/mdx-utils"

export const formatNpmInstallTabs: Plugin = () => {
  return (tree, _file, done) => {
    visit(tree, "mdxJsxFlowElement", (node: MdxJsxFlowElement) => {
      if (node?.name === "NpmInstallTabs") {
        const packages = node.attributes?.find(
          (attr): attr is MdxJsxAttribute =>
            attr.type === "mdxJsxAttribute" && attr.name === "packages",
        )
        const packageNames = packages ? extractNamesFromAttribute(packages) : []

        Object.assign(node, {
          lang: "shell",
          meta: null,
          type: "code",
          value: `npm install ${packageNames.join(" ")}`,
        })
      }
    })
    done()
  }
}
