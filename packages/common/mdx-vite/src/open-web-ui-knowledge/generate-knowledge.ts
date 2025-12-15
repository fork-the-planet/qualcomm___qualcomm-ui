// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import type {Parent} from "mdast"
import type {MdxJsxAttribute, MdxJsxFlowElement} from "mdast-util-mdx-jsx"
import {
  access,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises"
import {basename, dirname, extname, join, resolve} from "node:path"
import remarkFrontmatter from "remark-frontmatter"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkParseFrontmatter from "remark-parse-frontmatter"
import remarkStringify from "remark-stringify"
import {type Plugin, unified} from "unified"
import {visit} from "unist-util-visit"

import type {
  QuiComment,
  QuiCommentDisplayPart,
} from "@qualcomm-ui/typedoc-common"
import {kebabCase} from "@qualcomm-ui/utils/change-case"

import {remarkSelfLinkHeadings} from "../docs-plugin"
import {
  getPathnameFromPathSegments,
  getPathSegmentsFromFileName,
  remarkRemoveJsx,
} from "../docs-plugin/internal"
import {extractNamesFromAttribute} from "../docs-plugin/internal/services/mdx-utils"

import {loadEnv} from "./common"
import {loadKnowledgeConfigFromEnv} from "./load-config-from-env"
import type {WebUiKnowledgeConfig} from "./types"

interface PageInfo {
  demosFolder?: string
  id: string
  mdxFile: string
  name: string
  path: string
  url: string | undefined
}

interface ImportedModule {
  content: string
  path: string
}

interface ComponentProps {
  input?: PropInfo[]
  name: string
  output?: PropInfo[]
  props?: PropInfo[]
}

interface DocProps {
  props: Record<string, ComponentProps>
}

interface PropInfo {
  comment?: QuiComment
  defaultValue?: string
  name: string
  resolvedType?: {
    baseType?: string
    name?: string
    prettyType?: string
    required?: boolean
    type?: string
  }
  type: string
}

interface SimplifiedProp {
  defaultValue?: string
  description: string
  name: string
  propType?: "input" | "output" | undefined
  required: boolean | undefined
  type: string
}

interface ProcessedPage {
  content: string
  demoFiles: string[]
  frontmatter: Record<string, string>
  title: string
  url: string | undefined
}

// Pure utility functions (no config dependency)

async function exists(dirPath: string): Promise<boolean> {
  return access(dirPath)
    .then(() => true)
    .catch(() => false)
}

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

function isPreviewLine(trimmedLine: string): boolean {
  return (
    trimmedLine === "// preview" ||
    /^\{\s*\/\*\s*preview\s*\*\/\s*\}$/.test(trimmedLine) ||
    /^<!--\s*preview\s*-->$/.test(trimmedLine)
  )
}

function removePreviewLines(code: string): string {
  return code
    .split("\n")
    .filter((line) => !isPreviewLine(line.trim()))
    .join("\n")
}

function getIntroLines(projectName?: string, description?: string) {
  const lines: string[] = []

  if (projectName) {
    lines.push(`# ${projectName}`)
  }

  if (description) {
    lines.push("")
    lines.push(`> ${description}`)
  }

  return lines.join("\n")
}

function extractRelativeImports(content: string): string[] {
  const imports: string[] = []
  const importRegex =
    /^import\s+(?:{[^}]*}|[\w*]+|\*\s+as\s+\w+)?\s*(?:,\s*{[^}]*})?\s*from\s+["'](\.[^"']+)["']/gm
  let match: RegExpExecArray | null
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1])
  }
  return imports
}

async function resolveModulePath(
  importPath: string,
  fromFile: string,
): Promise<string | null> {
  const fromDir = dirname(fromFile)
  const baseResolved = resolve(fromDir, importPath)
  const extensions = [".ts", ".tsx", ".js", ".jsx", ""]
  for (const ext of extensions) {
    const fullPath = baseResolved + ext
    if (await exists(fullPath)) {
      return fullPath
    }
  }
  if (await exists(baseResolved)) {
    const indexPath = join(baseResolved, "index.ts")
    if (await exists(indexPath)) {
      return indexPath
    }
  }
  return null
}

function extractMetadata(metadata: string[] | undefined): string[][] {
  return (metadata ?? []).map((current) => {
    const [key, value] = current.split("=")
    return [key, value]
  })
}

const replaceNpmInstallTabs: Plugin = () => {
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

function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      obj,
    )
}

/**
 * Generator class that encapsulates all knowledge generation logic with shared
 * config.
 */
class KnowledgeGenerator {
  private readonly config: WebUiKnowledgeConfig
  private docProps: DocProps | null = null

  constructor(config: WebUiKnowledgeConfig) {
    this.config = config
  }

  async run(): Promise<void> {
    const extractedMetadata = extractMetadata(this.config.metadata)

    if (this.config.verbose) {
      console.log(`Scanning pages in: ${this.config.routeDir}`)
      if (this.config.exclude?.length) {
        console.log(`Excluding patterns: ${this.config.exclude.join(", ")}`)
      }
    }

    const [docProps, pages] = await Promise.all([
      this.loadDocProps(),
      this.scanPages(),
    ])

    this.docProps = docProps

    if (pages.length === 0) {
      console.log("No pages found.")
      return
    }

    if (this.config.verbose) {
      console.log(`Found ${pages.length} page(s)`)
    }

    const processedPages: ProcessedPage[] = []
    for (const page of pages) {
      try {
        const processed = await this.processComponent(page)
        processedPages.push(processed)
      } catch (error) {
        console.error(`Failed to process page: ${page.name}`)
        process.exit(1)
      }
    }

    if (this.config.clean) {
      await rm(this.config.outputPath, {force: true, recursive: true}).catch(
        () => {},
      )
    }

    if (this.config.outputMode === "aggregated") {
      await this.generateAggregatedOutput(processedPages, pages)
    } else {
      await mkdir(this.config.outputPath, {recursive: true}).catch(() => {})
      await this.generatePerPageExports(
        pages,
        processedPages,
        extractedMetadata,
      )
    }
  }

  private async loadDocProps(): Promise<DocProps | null> {
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
        console.log(`Error loading doc props: ${error}`)
      }
      return null
    }
  }

  private async scanPages(): Promise<PageInfo[]> {
    const components: PageInfo[] = []
    const excludePatterns = this.config.exclude ?? []

    const shouldExclude = (fileOrDir: string): boolean => {
      const dirName = basename(fileOrDir)
      return excludePatterns.some((pattern) => {
        if (pattern.includes("*")) {
          const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`)
          return regex.test(dirName)
        }
        return dirName === pattern
      })
    }

    const scanDirectory = async (dirPath: string): Promise<void> => {
      if (shouldExclude(dirPath)) {
        if (this.config.verbose) {
          console.log(`Excluding directory: ${basename(dirPath)}`)
        }
        return
      }

      const entries = await readdir(dirPath, {withFileTypes: true})
      const mdxFiles =
        entries.filter(
          (f) => f.name.endsWith(".mdx") && !shouldExclude(f.name),
        ) ?? []

      for (const mdxFile of mdxFiles) {
        const demosFolder = entries.find((f) => f.name === "demos")
        const demosFolderPath = demosFolder
          ? join(dirPath, demosFolder.name)
          : undefined

        const segments = getPathSegmentsFromFileName(
          join(dirPath, mdxFile.name),
          this.config.routeDir,
        )
        const url = getPathnameFromPathSegments(segments)

        components.push({
          demosFolder: demosFolderPath,
          id: segments.join("-").trim(),
          mdxFile: join(dirPath, mdxFile.name),
          name: segments.at(-1)!,
          path: dirPath,
          url: this.config.baseUrl
            ? new URL(url, this.config.baseUrl).toString()
            : undefined,
        })

        if (this.config.verbose) {
          console.log(`Found component: ${basename(dirPath)}`)
          console.log(`  Demos folder: ${demosFolderPath || "NOT FOUND"}`)
        }
      }

      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name)
        const stats = await stat(fullPath)
        if (stats.isDirectory()) {
          await scanDirectory(fullPath)
        }
      }
    }

    await scanDirectory(this.config.routeDir)
    return components
  }

  private async collectRelativeImports(
    filePath: string,
    visited: Set<string> = new Set(),
  ): Promise<ImportedModule[]> {
    const normalizedPath = resolve(filePath)
    if (visited.has(normalizedPath)) {
      return []
    }
    visited.add(normalizedPath)
    const modules: ImportedModule[] = []
    try {
      const content = await readFile(normalizedPath, "utf-8")
      const relativeImports = extractRelativeImports(content)
      for (const importPath of relativeImports) {
        const resolvedPath = await resolveModulePath(importPath, normalizedPath)
        if (!resolvedPath) {
          if (this.config.verbose) {
            console.log(
              `  Could not resolve import: ${importPath} from ${normalizedPath}`,
            )
          }
          continue
        }
        const importContent = await readFile(resolvedPath, "utf-8")
        modules.push({
          content: importContent,
          path: resolvedPath,
        })
        const nestedModules = await this.collectRelativeImports(
          resolvedPath,
          visited,
        )
        modules.push(...nestedModules)
      }
    } catch (error) {
      if (this.config.verbose) {
        console.log(`  Error processing ${normalizedPath}: ${error}`)
      }
    }
    return modules
  }

  private extractProps(
    props: ComponentProps,
    isPartial: boolean,
  ): SimplifiedProp[] {
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

  private formatComment(comment: QuiComment | null): string {
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
            if (
              this.config.outputMode === "per-page" &&
              "tag" in part &&
              part.tag === "@link" &&
              typeof part.target === "string"
            ) {
              return `[${part.text}](${part.target})`
            }
            return part.text
        }
      })
      .join("")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
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

  /**
   * Creates a remark plugin that replaces TypeDocProps JSX elements with JSON
   * code blocks containing component prop documentation.
   */
  private async replaceThemeNodes(): Promise<Plugin> {
    let themes: any | null = null
    try {
      // may not be available since this is an optional dependency
      themes = await import("@qualcomm-ui/tailwind-plugin/theme")
    } catch {
      return () => {}
    }

    const handlers: Record<string, (node: MdxJsxFlowElement) => unknown> = {
      ColorTable: (node) => {
        const path = this.getAttrExpression(node, "data")
        return path && getPath(themes, path)
      },
      FontTable: (node) => {
        const path = this.getAttrExpression(node, "data")
        return path && getPath(themes, path)
      },
      ThemePropertyTable: (node) => {
        const path = this.getAttrExpression(node, "data")
        const property = this.getAttrExpression(node, "cssProperty")
        const data = path && getPath(themes, path)
        return path && property ? {cssPropertyName: property, data} : undefined
      },
    }

    return () => (tree, _file, done) => {
      visit(tree, "mdxJsxFlowElement", (node: MdxJsxFlowElement) => {
        const handler = node.name && handlers[node.name]
        if (!handler) {
          return
        }

        const data = handler(node)
        if (!data) {
          console.warn(`No theme data for ${node.name}`)
          return
        }

        Object.assign(node, {
          lang: "json",
          meta: null,
          type: "code",
          value: JSON.stringify(data, null, 2),
        })
      })
      done()
    }
  }

  private getAttrExpression(
    node: MdxJsxFlowElement,
    name: string,
  ): string | null {
    const attr = node.attributes?.find(
      (a): a is MdxJsxAttribute =>
        a.type === "mdxJsxAttribute" && a.name === name,
    )
    if (!attr?.value) {
      return null
    }
    if (typeof attr.value === "string") {
      return attr.value
    } else if (typeof attr.value === "object" && "value" in attr.value) {
      return attr.value.value
    }
    return null
  }

  /**
   * Creates a remark plugin that replaces TypeDocProps JSX elements with JSON
   * code blocks containing component prop documentation.
   */
  private replaceTypeDocProps(): Plugin {
    return () => (tree, _file, done) => {
      visit(
        tree,
        "mdxJsxFlowElement",
        (
          node: MdxJsxFlowElement,
          index: number | undefined,
          parent: Parent | undefined,
        ) => {
          if (node?.name !== "TypeDocProps") {
            return
          }
          const nameAttr = node.attributes?.find(
            (attr): attr is MdxJsxAttribute =>
              attr.type === "mdxJsxAttribute" && attr.name === "name",
          )
          const isPartial = node.attributes?.some(
            (attr): attr is MdxJsxAttribute =>
              attr.type === "mdxJsxAttribute" && attr.name === "partial",
          )
          if (!this.docProps || !nameAttr) {
            if (parent && index !== undefined) {
              parent.children.splice(index, 1)
            }
            return
          }
          const propsNames = extractNamesFromAttribute(nameAttr)
          if (propsNames.length === 0) {
            if (parent && index !== undefined) {
              parent.children.splice(index, 1)
            }
            return
          }
          const propsName = propsNames[0]
          const componentProps = this.docProps.props[propsName]
          if (!componentProps) {
            if (this.config.verbose) {
              console.log(`  TypeDocProps not found: ${propsName}`)
            }
            if (parent && index !== undefined) {
              parent.children.splice(index, 1)
            }
            return
          }
          const propsDoc = this.extractProps(componentProps, Boolean(isPartial))
          if (this.config.verbose) {
            console.log(
              `  Replaced TypeDocProps ${propsName} with API documentation`,
            )
          }
          Object.assign(node, {
            lang: "json",
            meta: null,
            type: "code",
            value: JSON.stringify(propsDoc, null, 2),
          })
        },
      )
      done()
    }
  }

  /**
   * Creates a remark plugin that replaces demo JSX elements (QdsDemo, CodeDemo,
   * Demo) with code blocks containing the demo source code from the demos folder.
   */
  private replaceDemos(
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
                if (this.config.verbose) {
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

                if (this.config.verbose) {
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
                if (this.config.verbose) {
                  console.log(`  Error reading demo ${demoName}: ${error}`)
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

  /**
   * Processes MDX content by transforming JSX elements (TypeDocProps, demos)
   * into markdown, resolving relative links, and cleaning up formatting.
   */
  private async processMdxContent(
    mdxContent: string,
    pageUrl: string | undefined,
    demosFolder: string | undefined,
  ): Promise<{content: string; demoFiles: string[]}> {
    const demoFiles: string[] = []
    let processedContent = mdxContent

    const lines = processedContent.split("\n")
    const titleLine = lines.findIndex((line) => line.startsWith("# "))
    processedContent =
      titleLine >= 0 ? lines.slice(titleLine + 1).join("\n") : processedContent

    processedContent = processedContent.replace(
      /\[([^\]]+)\]\(\.\/#([^)]+)\)/g,
      (_, text, anchor) =>
        pageUrl && this.config.outputMode === "per-page"
          ? `[${text}](${pageUrl}#${anchor})`
          : text,
    )

    const processor = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(this.replaceTypeDocProps())
      .use(await this.replaceThemeNodes())
      .use(this.replaceDemos(demosFolder, demoFiles))
      .use(remarkStringify)

    const processed = await processor.process(processedContent)
    processedContent = String(processed)

    processedContent = processedContent.replace(/\n\s*\n\s*\n/g, "\n\n")

    return {content: processedContent, demoFiles}
  }

  private async processComponent(component: PageInfo): Promise<ProcessedPage> {
    try {
      const mdxContent = await readFile(component.mdxFile, "utf-8")
      if (this.config.verbose) {
        console.log(`Processing page: ${component.name}`)
      }
      const processor = unified()
        .use(remarkParse)
        .use(remarkMdx)
        .use(replaceNpmInstallTabs)
        .use(remarkFrontmatter, ["yaml"])
        .use(remarkParseFrontmatter)

      if (this.config.outputMode === "per-page") {
        processor.use(remarkSelfLinkHeadings(component.url))
      }

      processor.use(remarkStringify)
      const parsed = await processor.process(mdxContent)
      const frontmatter = (parsed.data as any)?.frontmatter || {}
      const {content: processedContent, demoFiles} =
        await this.processMdxContent(
          String(parsed),
          component.url,
          component.demosFolder,
        )
      const removeJsxProcessor = unified()
        .use(remarkParse)
        .use(remarkMdx)
        .use(remarkRemoveJsx)
        .use(remarkStringify)
      const removedJsx = String(
        await removeJsxProcessor.process(processedContent),
      )
      const contentWithoutFrontmatter = removedJsx.replace(
        /^---[\s\S]*?---\n/,
        "",
      )
      const title = frontmatter.title || component.name

      return {
        content: contentWithoutFrontmatter.trim(),
        demoFiles,
        frontmatter,
        title,
        url: component.url,
      }
    } catch (error) {
      console.error(`Error processing component ${component.name}:`, error)
      throw error
    }
  }

  private async generateLlmsTxt(pages: Array<ProcessedPage>): Promise<string> {
    const lines: string[] = [
      getIntroLines(this.config.name, this.config.description),
    ]

    lines.push("")

    for (const page of pages) {
      const content = page.content.split("\n").map((line) => {
        if (line.startsWith("#")) {
          return `#${line}`
        }
        return line
      })

      if (content.every((line) => !line.trim())) {
        continue
      }

      lines.push(`## ${page.title}`)
      lines.push("")

      lines.push(content.join("\n"))
      lines.push("")
    }

    return lines.join("\n")
  }

  private async generateAggregatedOutput(
    processedPages: ProcessedPage[],
    pages: PageInfo[],
  ): Promise<void> {
    const llmsTxtContent = await this.generateLlmsTxt(processedPages)
    await mkdir(dirname(this.config.outputPath), {recursive: true}).catch(
      () => {},
    )
    await writeFile(this.config.outputPath, llmsTxtContent, "utf-8")
    const outputStats = await stat(this.config.outputPath)
    const outputSizeKb = (outputStats.size / 1024).toFixed(1)
    console.log(
      `Generated ${this.config.outputPath} with ${pages.length} component(s) at: ${this.config.outputPath}`,
    )
    console.log(`File size: ${outputSizeKb} KB`)
  }

  private async generatePerPageExports(
    pages: PageInfo[],
    processedPages: ProcessedPage[],
    metadata: string[][],
  ): Promise<void> {
    await mkdir(dirname(this.config.outputPath), {recursive: true}).catch(
      () => {},
    )
    const count = processedPages.length
    let totalSize = 0
    await Promise.all(
      processedPages.map(async (processedPage, index) => {
        const page = pages[index]
        const lines: string[] = []
        if (metadata.length || page.url) {
          lines.push("---")
          if (page.url) {
            lines.push(`url: ${page.url}`)
          }
          if (metadata.length) {
            for (const [key, value] of metadata) {
              lines.push(`${key}: ${value}`)
            }
          }
          lines.push("---")
          lines.push("")
        }

        lines.push(`# ${processedPage.title}`)
        lines.push("")
        if (processedPage.frontmatter?.title) {
          page.name = processedPage.frontmatter.title
        }
        let content = processedPage.content
        if (this.config.pageTitlePrefix) {
          content = content.replace(
            `# ${page.name}`,
            `# ${this.config.pageTitlePrefix} ${page.name}`,
          )
          page.name = `${this.config.pageTitlePrefix} ${page.name}`
        }
        lines.push(content)
        lines.push("")

        if (processedPage.demoFiles.length > 0) {
          if (this.config.verbose) {
            console.log(
              `Collecting imports for ${page.name} from ${processedPage.demoFiles.length} demo files`,
            )
          }

          const allImports: ImportedModule[] = []
          for (const demoFile of processedPage.demoFiles) {
            const imports = await this.collectRelativeImports(
              demoFile,
              new Set(),
            )
            allImports.push(...imports)
          }

          const uniqueImports = Array.from(
            new Map(allImports.map((m) => [m.path, m])).values(),
          )

          if (this.config.verbose) {
            console.log(
              `  Collected ${uniqueImports.length} unique import modules`,
            )
          }

          if (uniqueImports.length > 0) {
            lines.push("## Related Source Files")
            lines.push("")
            for (const importedModule of uniqueImports) {
              const ext = extname(importedModule.path).slice(1)
              lines.push(`### ${basename(importedModule.path)}`)
              lines.push("")
              lines.push(`\`\`\`${ext}`)
              lines.push(importedModule.content)
              lines.push("```")
              lines.push("")
            }
          }
        }

        const outfile = `${resolve(this.config.outputPath)}/${kebabCase(page.id || page.name)}.md`
        await writeFile(outfile, lines.join("\n"), "utf-8")
        const stats = await stat(outfile)
        totalSize += stats.size / 1024
      }),
    )
    console.log(`Generated ${count} component(s) in ${this.config.outputPath}`)
    console.log(`Folder size: ${totalSize.toFixed(1)} KB`)
  }
}

/**
 * Generates knowledge documentation from MDX files.
 * This is the main entry point that maintains backwards compatibility.
 */
export async function generate(config: WebUiKnowledgeConfig): Promise<void> {
  const generator = new KnowledgeGenerator(config)
  await generator.run()
}

export function addGenerateKnowledgeCommand() {
  program
    .description("Generate llms.txt from QUI Docs documentation")
    .command("generate-llms-txt")
    .option("-n, --name <name>", "Project name for llms.txt header")
    .requiredOption("-m, --output-mode <outputMode>")
    .option("-o, --outputPath <outputPath>", "Output file or directory.")
    .option(
      "-d, --description <description>",
      "Project description for llms.txt",
    )
    .option("-v, --verbose", "Enable verbose logging", false)
    .option(
      "--exclude <patterns...>",
      "Exclude file or folder patterns (supports * wildcards)",
      [],
    )
    .option("--base-url <url>", "Base URL for component documentation links")
    .option("--metadata <pairs...>", "metadata key-value pairs")
    .option("--clean", "Clean the output path before generating")
    .option("--include-imports", "Include relative import source files", true)
    .action(async (options) => {
      loadEnv()
      const knowledgeConfig = loadKnowledgeConfigFromEnv({
        ...options,
        outputMode:
          options.outputMode === "per-page" ? "per-page" : "aggregated",
      })
      await generate(knowledgeConfig)
    })
}
