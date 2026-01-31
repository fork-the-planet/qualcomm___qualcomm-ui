import {readFile} from "node:fs/promises"
import {dirname, join, resolve} from "node:path"

import type {
  QuiComment,
  QuiCommentDisplayPart,
} from "@qualcomm-ui/typedoc-common"

import type {WebUiKnowledgeConfig} from "../types"

import type {
  ComponentProps,
  DocProps,
  PropInfo,
  SimplifiedProp,
} from "./generator.types"
import {exists} from "./utils"

function extractBestType(propInfo: PropInfo): string {
  const type = propInfo.resolvedType?.prettyType || propInfo.type

  return cleanType(type.startsWith("| ") ? type.substring(2) : type)
}

function extractRequired(propInfo: PropInfo, isPartial: boolean): boolean {
  return Boolean(propInfo.resolvedType?.required && !isPartial)
}

function cleanType(type: string): string {
  return type.replace(/\n/g, " ").replace(/\s+/g, " ").trim()
}

function cleanDefaultValue(defaultValue: string): string {
  return defaultValue.replace(/^\n+/, "").replace(/\n+$/, "").trim()
}

export class PropFormatter {
  private readonly config: WebUiKnowledgeConfig
  constructor(config: WebUiKnowledgeConfig) {
    this.config = config
  }

  async loadDocProps(): Promise<DocProps | null> {
    const resolvedDocPropsPath = this.config.docPropsPath
      ? (await exists(this.config.docPropsPath))
        ? this.config.docPropsPath
        : resolve(process.cwd(), this.config.docPropsPath)
      : join(dirname(this.config.routeDir), "doc-props.json")

    if (!(await exists(resolvedDocPropsPath))) {
      if (this.config.verbose) {
        console.log(`Doc props file not found at: ${resolvedDocPropsPath}`)
      }
      return null
    }

    try {
      const content = await readFile(resolvedDocPropsPath, "utf-8")
      const docProps = JSON.parse(content) as DocProps
      if (this.config.verbose) {
        console.log(`Loaded doc props from: ${resolvedDocPropsPath}`)
        console.log(
          `Found ${Object.keys(docProps.props).length} component types`,
        )
      }
      return docProps
    } catch (error) {
      if (this.config.verbose) {
        console.log("Error loading doc props", error)
      }
      return null
    }
  }

  private formatCommentParts(parts: QuiCommentDisplayPart[]): string {
    return parts
      .map((part) => {
        switch (part.kind) {
          case "text":
            return part.text
          case "code":
            const codeText = part.text
              .replace(/```\w*\n?/g, "") // Remove opening code blocks with optional language
              .replace(/\n?```/g, "") // Remove closing code blocks
              .trim()

            if (codeText.includes("\n")) {
              return `\`\`\`\n${codeText}\n\`\`\``
            } else {
              return codeText
            }
          default:
            // render link text only, but remove certain text altogether
            if (
              this.config.outputMode === "per-page" &&
              "tag" in part &&
              part.tag === "@link" &&
              typeof part.target === "string"
            ) {
              if (part.text === "Learn more") {
                return ""
              }
            }
            return part.text
        }
      })
      .join("")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }

  formatComment(comment: QuiComment | null): string {
    if (!comment) {
      return ""
    }

    const parts: string[] = []

    if (comment.summary && comment.summary.length > 0) {
      const summaryText = this.formatCommentParts(comment.summary)
      if (summaryText.trim()) {
        parts.push(summaryText.trim())
      }
    }

    if (comment.blockTags && comment.blockTags.length > 0) {
      for (const blockTag of comment.blockTags) {
        const tagContent = this.formatCommentParts(blockTag.content)
        if (tagContent.trim()) {
          const tagName = blockTag.tag.replace("@", "")

          if (tagName === "default" || tagName === "defaultValue") {
            continue
          }

          if (tagName === "example") {
            parts.push(`**Example:**\n\`\`\`\n${tagContent.trim()}\n\`\`\``)
          } else {
            parts.push(`**${tagName}:** ${tagContent.trim()}`)
          }
        }
      }
    }

    return parts.join("\n\n")
  }

  extractProps(props: ComponentProps, isPartial: boolean): SimplifiedProp[] {
    const propsInfo: SimplifiedProp[] = []

    if (props.props?.length) {
      propsInfo.push(
        ...props.props.map((prop) => this.convertPropInfo(prop, isPartial)),
      )
    }
    if (props.input?.length) {
      propsInfo.push(
        ...props.input.map((prop) =>
          this.convertPropInfo(prop, isPartial, "input"),
        ),
      )
    }
    if (props.output?.length) {
      propsInfo.push(
        ...props.output.map((prop) =>
          this.convertPropInfo(prop, isPartial, "output"),
        ),
      )
    }

    return propsInfo
  }

  private convertPropInfo(
    propInfo: PropInfo,
    isPartial: boolean,
    propType: "input" | "output" | undefined = undefined,
  ): SimplifiedProp {
    return {
      name: propInfo.name,
      type: extractBestType(propInfo),
      ...(propInfo.defaultValue && {
        defaultValue: cleanDefaultValue(propInfo.defaultValue),
      }),
      description: this.formatComment(propInfo.comment || null),
      propType,
      required: extractRequired(propInfo, isPartial) || undefined,
    }
  }
}
