// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Code, Heading, Parent, Root, RootContent, Text} from "mdast"
import remarkStringify from "remark-stringify"
import {unified} from "unified"
import {visit} from "unist-util-visit"

import {kebabCase} from "@qualcomm-ui/utils/change-case"

import type {CodeExample, SectionEntry, SectionMetadata} from "./section.types"

export interface SectionExtractorOptions {
  /**
   * Header depths that define section boundaries.
   * @default [1, 2, 3, 4]
   */
  depths?: number[]

  /**
   * Minimum content length to create a section entry.
   * @default 0
   */
  minContentLength?: number
}

export interface PageInfo {
  frontmatter: Record<string, unknown>
  id: string
  title: string
  url?: string
}

interface HeaderInfo {
  depth: number
  text: string
}

interface PendingSection {
  depth: number
  headerPath: string[]
  nodes: RootContent[]
  startIndex: number
}

/**
 * Extracts sections from processed markdown content, organized by headers.
 */
export class SectionExtractor {
  private readonly depths: Set<number>
  private readonly minContentLength: number

  constructor(options?: SectionExtractorOptions) {
    const defaultDepths = [1, 2, 3, 4]
    this.depths = new Set(options?.depths ?? defaultDepths)
    this.minContentLength = options?.minContentLength ?? 0
  }

  /**
   * Extracts sections from a parsed AST.
   */
  extract(tree: Root, pageInfo: PageInfo): SectionEntry[] {
    const sections: SectionEntry[] = []
    const headerStack: HeaderInfo[] = [{depth: 1, text: pageInfo.title}]

    let pendingSection: PendingSection | null = null

    const finalizeSection = () => {
      if (!pendingSection || pendingSection.nodes.length === 0) {
        return
      }

      const entry = this.buildSectionEntry(pendingSection, pageInfo)
      if (entry && entry.content.length >= this.minContentLength) {
        sections.push(entry)
      }
    }

    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i]

      if (node.type === "heading") {
        const heading = node

        if (!this.depths.has(heading.depth)) {
          if (pendingSection) {
            pendingSection.nodes.push(node)
          }
          continue
        }

        finalizeSection()

        while (
          headerStack.length > 0 &&
          headerStack[headerStack.length - 1].depth >= heading.depth
        ) {
          headerStack.pop()
        }

        const headingText = this.getHeadingText(heading)
        headerStack.push({depth: heading.depth, text: headingText})

        pendingSection = {
          depth: heading.depth,
          headerPath: headerStack.map((h) => h.text),
          nodes: [],
          startIndex: i,
        }
      } else if (pendingSection) {
        pendingSection.nodes.push(node)
      }
    }

    finalizeSection()

    return sections
  }

  private getHeadingText(heading: Heading): string {
    let text = ""
    visit(heading, "text", (node: Text) => {
      text += node.value
    })
    return text.trim()
  }

  private buildSectionEntry(
    section: PendingSection,
    pageInfo: PageInfo,
  ): SectionEntry | null {
    const {metadata, nodes} = this.extractMetadata(section.nodes)

    if (nodes.length === 0) {
      return null
    }

    const startOffset = nodes[0]?.position?.start.offset ?? 0
    const lastNode = nodes[nodes.length - 1]
    const endOffset = lastNode?.position?.end.offset ?? 0

    const contentNodes: RootContent[] = []
    const codeExamples: CodeExample[] = []

    for (const node of nodes) {
      if (node.type === "code") {
        const codeNode = node as Code & {
          data?: {typeDocProps?: {name: string; props: string[]}}
        }

        if (codeNode.data?.typeDocProps) {
          const {name, props} = codeNode.data.typeDocProps
          metadata.props = [...(metadata.props ?? []), ...props]
          metadata.type = name
        }

        const proseBeforeCode = this.nodesToMarkdown(contentNodes).trim()

        codeExamples.push({
          code: codeNode.value,
          insertionOffset: proseBeforeCode.length,
          language: codeNode.lang ?? "",
        })
      } else {
        contentNodes.push(node)
      }
    }

    const content = this.nodesToMarkdown(contentNodes)

    const sectionId = this.generateSectionId(section.headerPath)
    const wordCount = this.countWords(content)
    const url = pageInfo.url
      ? `${pageInfo.url}#${this.generateAnchorId(section.headerPath.at(-1) ?? "")}`
      : undefined

    return {
      codeExamples,
      content: content.trim(),
      depth: section.depth,
      endOffset,
      headerPath: section.headerPath,
      metadata,
      pageFrontmatter: pageInfo.frontmatter,
      pageId: pageInfo.id,
      sectionId,
      startOffset,
      url,
      wordCount,
    }
  }

  private extractMetadata(nodes: RootContent[]): {
    metadata: SectionMetadata
    nodes: RootContent[]
  } {
    const metadata: SectionMetadata = {}
    const filteredNodes: RootContent[] = []

    for (const node of nodes) {
      if (node.type === "paragraph") {
        const firstChild = (node as Parent).children?.[0]
        if (firstChild?.type === "text") {
          const text = firstChild.value
          const metaMatch = text.match(/^:::\s*meta\s*/)

          if (metaMatch) {
            const parsed = this.parseMetaBlock(text)
            Object.assign(metadata, parsed)
            continue
          }
        }
      }
      filteredNodes.push(node)
    }

    return {metadata, nodes: filteredNodes}
  }

  private parseMetaBlock(text: string): SectionMetadata {
    const metadata: SectionMetadata = {}

    const afterOpen = text.replace(/^:::\s*meta\s*/, "")
    const closeIndex = afterOpen.lastIndexOf(":::")
    const content =
      closeIndex !== -1 ? afterOpen.slice(0, closeIndex) : afterOpen

    const lines = content.split("\n")
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) {
        continue
      }

      const colonIndex = trimmed.indexOf(":")
      if (colonIndex === -1) {
        continue
      }

      const key = trimmed.slice(0, colonIndex).trim()
      const value = trimmed.slice(colonIndex + 1).trim()

      if (key && value) {
        metadata[key] = this.parseValue(value)
      }
    }

    return metadata
  }

  private parseValue(value: string): string | string[] {
    const trimmed = value.trim()

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      const inner = trimmed.slice(1, -1)
      return inner
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    }

    return trimmed
  }

  private nodesToMarkdown(nodes: RootContent[]): string {
    const tree: Root = {children: nodes, type: "root"}
    const processor = unified().use(remarkStringify)
    return processor.stringify(tree)
  }

  private generateSectionId(headerPath: string[]): string {
    return headerPath.map((h) => kebabCase(h)).join("-")
  }

  private generateAnchorId(headerText: string): string {
    return kebabCase(headerText)
  }

  private countWords(text: string): number {
    const words = text.match(/\b\w+\b/g)
    return words?.length ?? 0
  }
}
