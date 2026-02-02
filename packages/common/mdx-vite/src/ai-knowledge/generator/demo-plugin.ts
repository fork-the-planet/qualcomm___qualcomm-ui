import type {Parent} from "mdast"
import type {MdxJsxAttribute, MdxJsxFlowElement} from "mdast-util-mdx-jsx"
import {readFile} from "node:fs/promises"
import {join} from "node:path"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

import {kebabCase} from "@qualcomm-ui/utils/change-case"

import {getConfig} from "./config"
import {exists, removePreviewLines} from "./utils"

/**
 * Creates a remark plugin that replaces demo JSX elements (QdsDemo, CodeDemo,
 * Demo) with code blocks containing the demo source code from the demos folder.
 */
export function formatDemos(
  demosFolder: string | undefined,
  demoFiles: string[],
): Plugin {
  return () => async (tree) => {
    const promises: Promise<void>[] = []

    visit(
      tree,
      "mdxJsxFlowElement",
      (
        node: MdxJsxFlowElement,
        index: number | undefined,
        parent: Parent | undefined,
      ) => {
        if (
          !node?.name ||
          !["QdsDemo", "CodeDemo", "Demo"].includes(node.name)
        ) {
          return
        }

        const nameAttr = node.attributes?.find(
          (attr): attr is MdxJsxAttribute =>
            attr.type === "mdxJsxAttribute" && attr.name === "name",
        )

        const nodeAttr = node.attributes?.find(
          (attr): attr is MdxJsxAttribute =>
            attr.type === "mdxJsxAttribute" && attr.name === "node",
        )

        let demoName: string | undefined

        if (nameAttr && typeof nameAttr.value === "string") {
          demoName = nameAttr.value
        } else if (nodeAttr?.value && typeof nodeAttr.value !== "string") {
          const estree = nodeAttr.value.data?.estree
          if (estree?.body?.[0]?.type === "ExpressionStatement") {
            const expression = estree.body[0].expression
            if (
              expression.type === "MemberExpression" &&
              expression.object.type === "Identifier" &&
              expression.object.name === "Demo" &&
              expression.property.type === "Identifier"
            ) {
              demoName = expression.property.name
            }
          }
        }

        if (!demoName) {
          if (parent && index !== undefined) {
            parent.children.splice(index, 1)
          }
          return
        }

        promises.push(
          (async () => {
            const kebabName = kebabCase(demoName)
            let filePath = `${kebabName}.tsx`

            if (!demosFolder) {
              if (getConfig().verbose) {
                console.log(`  No demos folder for ${demoName}`)
              }
              if (parent && index !== undefined) {
                parent.children.splice(index, 1)
              }
              return
            }

            let demoFilePath = join(demosFolder, filePath)
            let isAngularDemo = false

            if (!(await exists(demoFilePath))) {
              demoFilePath = join(demosFolder, `${kebabName}.ts`)
              if (await exists(demoFilePath)) {
                isAngularDemo = true
                filePath = `${kebabCase(demoName).replace("-component", ".component")}.ts`
                demoFilePath = join(demosFolder, filePath)
              } else {
                console.log(`  Demo not found ${demoName}`)
                if (parent && index !== undefined) {
                  parent.children.splice(index, 1)
                }
                return
              }
            }

            try {
              const demoCode = await readFile(demoFilePath, "utf-8")
              const cleanedCode = removePreviewLines(demoCode)

              if (getConfig().verbose) {
                console.log(`  Replaced demo ${demoName} with source code`)
              }

              demoFiles.push(demoFilePath)

              Object.assign(node, {
                lang: isAngularDemo ? "angular-ts" : "tsx",
                meta: null,
                type: "code",
                value: cleanedCode,
              })
            } catch (error) {
              if (getConfig().verbose) {
                console.log(`Error reading demo ${demoName}`, error)
              }
              if (parent && index !== undefined) {
                parent.children.splice(index, 1)
              }
            }
          })(),
        )
      },
    )

    await Promise.all(promises)
  }
}
