// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import AdmZip from "adm-zip"
import chalk from "chalk"
import type {Link, Parent, Root} from "mdast"
import {minimatch} from "minimatch"
import {mkdir, readdir, readFile, rm, stat, writeFile} from "node:fs/promises"
import {basename, dirname, join, relative, resolve} from "node:path"
import remarkFrontmatter from "remark-frontmatter"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkParseFrontmatter from "remark-parse-frontmatter"
import remarkStringify from "remark-stringify"
import {type Plugin, unified} from "unified"
import {visit} from "unist-util-visit"

import type {
  ExportManifest,
  KnowledgePageData,
  ManifestEntry,
} from "@qualcomm-ui/mdx-common"
import {kebabCase} from "@qualcomm-ui/utils/change-case"

import {
  getPathnameFromPathSegments,
  getPathSegmentsFromFileName,
  remarkRemoveJsx,
} from "../../docs-plugin/internal"
import {remarkExtractMeta} from "../../docs-plugin/remark/remark-extract-meta"
import type {AiKnowledgeConfig} from "../types"

import {getConfig, setConfig} from "./config"
import {formatDemos} from "./demo-plugin"
import {PropFormatter} from "./doc-props-plugin"
import type {MdxFlowExpression, ProcessedPage} from "./generator.types"
import {formatNpmInstallTabs} from "./npm-install-tabs-plugin"
import {formatThemeNodes} from "./qds-theme-plugin"
import {SectionExtractor} from "./section-extractor"
import type {KnowledgeSections, SectionEntry} from "./section.types"
import {computeMd5, extractMetadata, getIntroLines} from "./utils"

/**
 * Generator class that encapsulates all knowledge generation logic with shared
 * config.
 */
export class KnowledgeGenerator {
  private readonly config: AiKnowledgeConfig
  private propFormatter: PropFormatter

  constructor(config: AiKnowledgeConfig) {
    setConfig(config)
    this.config = getConfig()
    this.propFormatter = new PropFormatter()
  }

  async run(): Promise<KnowledgePageData[]> {
    const extractedMetadata = extractMetadata(this.config.metadata)

    if (this.config.verbose) {
      console.log(`Scanning pages in: ${this.config.routeDir}`)
      if (this.config.exclude?.length) {
        console.log(`Excluding patterns: ${this.config.exclude.join(", ")}`)
      }
    }

    const [pages] = await Promise.all([
      this.scanPages(),
      this.propFormatter.loadDocProps(),
    ])

    if (pages.length === 0) {
      console.log("No pages found.")
      return []
    }

    if (this.config.verbose) {
      console.log(`Found ${pages.length} page(s)`)
    }

    const processedPages: ProcessedPage[] = []
    for (const page of pages) {
      try {
        const processed = await this.processMdxPage(page)
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

    return pages
  }

  private async scanPages(): Promise<KnowledgePageData[]> {
    const components: KnowledgePageData[] = []
    const excludePatterns = this.config.exclude ?? []

    const shouldExclude = (absolutePath: string): boolean => {
      if (excludePatterns.length === 0) {
        return false
      }
      const relativePath = relative(this.config.routeDir, absolutePath)
      return excludePatterns.some((pattern) =>
        minimatch(relativePath, pattern, {matchBase: true}),
      )
    }

    const scanDirectory = async (dirPath: string): Promise<void> => {
      if (shouldExclude(dirPath)) {
        if (this.config.verbose) {
          console.log(
            `Excluding directory: ${relative(this.config.routeDir, dirPath)}`,
          )
        }
        return
      }

      const entries = await readdir(dirPath, {withFileTypes: true})
      const mdxFiles =
        entries.filter(
          (f) =>
            f.name.endsWith(".mdx") && !shouldExclude(join(dirPath, f.name)),
        ) ?? []

      const pageIdPrefix = this.config.pageIdPrefix ?? ""

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
          filePath: dirPath,
          id: `${pageIdPrefix ? `${pageIdPrefix}-` : ""}${segments.join("-").trim()}`,
          mdxFile: join(dirPath, mdxFile.name),
          name: segments.at(-1)!,
          pathname: url,
          url: this.config.baseUrl
            ? new URL(url, this.config.baseUrl).toString()
            : undefined,
        })

        if (this.config.verbose) {
          console.log(`Found file: ${basename(dirPath)}`)
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

  private formatFrontmatterExpressions(
    frontmatter: Record<string, any>,
  ): Plugin {
    return () => (tree) => {
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

          if (frontmatter.description) {
            parent.children.splice(index, 1, {
              children: [{type: "text", value: frontmatter.description}],
              type: "paragraph",
            })
          } else {
            parent.children.splice(index, 1)
          }
        },
      )

      const root = tree as Parent
      const h1Index = root.children.findIndex((node: any) => {
        if (node.type !== "heading" || node.depth !== 1) {
          return false
        }
        return node.children?.some(
          (child: any) =>
            child.type === "mdxTextExpression" &&
            child.value?.includes("frontmatter"),
        )
      })
      if (h1Index >= 0) {
        root.children.splice(h1Index, 1)
      }
    }
  }

  /**
   * Creates a remark plugin that transforms relative URLs to absolute URLs.
   */
  private transformRelativeUrls(pageUrl?: string): Plugin {
    const baseUrl = this.config.baseUrl
    return () => (tree) => {
      if (!baseUrl || this.config.outputMode !== "per-page") {
        return
      }
      visit(tree, "link", (node: Link) => {
        if (node.url.startsWith("/")) {
          node.url = `${baseUrl}${node.url}`
        } else if (node.url.startsWith("./#") && pageUrl) {
          node.url = `${pageUrl}${node.url.slice(2)}`
        }
      })
    }
  }

  private applyPlugins(opts: KnowledgePageData, processor: any) {
    if (this.config.mdxPlugins) {
      this.config.mdxPlugins.forEach((plugin) => {
        processor.use(plugin(opts))
      })
    }
  }

  private filterFrontmatter(
    frontmatter: Record<string, unknown>,
  ): Record<string, unknown> {
    if (!this.config.frontmatter?.include?.length) {
      return frontmatter
    }

    const includePatterns = this.config.frontmatter.include
    const excludePatterns = this.config.frontmatter.exclude ?? []
    const filtered: Record<string, unknown> = {}

    for (const [field, value] of Object.entries(frontmatter)) {
      if (value === undefined) {
        continue
      }
      const isIncluded = includePatterns.some((pattern) =>
        minimatch(field, pattern),
      )
      const isExcluded = excludePatterns.some((pattern) =>
        minimatch(field, pattern),
      )
      if (isIncluded && !isExcluded) {
        filtered[field] = value
      }
    }

    return filtered
  }

  /**
   * Processes MDX content by transforming JSX elements (TypeDocProps, demos)
   * into Markdown, resolving relative links, and cleaning up formatting.
   */
  private async processMdxContent(
    mdxContent: string,
    pageInfo: KnowledgePageData,
    frontmatter: Record<string, any>,
  ): Promise<Root> {
    const processor = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkFrontmatter, ["yaml"])
      .use(this.propFormatter.formatTypeDocProps())
      .use(this.formatFrontmatterExpressions(frontmatter))
      .use(await formatThemeNodes())
      .use(formatDemos(pageInfo.demosFolder))
      .use(this.transformRelativeUrls(pageInfo.url))

    this.applyPlugins(pageInfo, processor)

    processor.use(remarkStringify)

    return (await processor.run(processor.parse(mdxContent))) as Root
  }

  private async processMdxPage(
    pageInfo: KnowledgePageData,
  ): Promise<ProcessedPage> {
    try {
      const mdxContent = await readFile(pageInfo.mdxFile, "utf-8")
      if (this.config.verbose) {
        console.log(`Processing page: ${pageInfo.name}`)
      }
      const processor = unified()
        .use(remarkParse)
        .use(remarkMdx)
        .use(formatNpmInstallTabs)
        .use(remarkFrontmatter, ["yaml"])
        .use(remarkParseFrontmatter)
        .use(remarkStringify)
      const parsed = await processor.process(mdxContent)
      const frontmatter = (parsed.data as any)?.frontmatter || {}
      const ast = await this.processMdxContent(
        String(parsed),
        pageInfo,
        frontmatter,
      )

      const removeJsxProcessor = unified()
        .use(remarkMdx)
        .use(remarkFrontmatter, ["yaml"])
        .use(remarkRemoveJsx)
        .use(remarkStringify)
      const sectionAst = removeJsxProcessor.runSync(ast) as Root
      const removedJsx = String(removeJsxProcessor.stringify(sectionAst))
      const rawContent = removedJsx
        .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "")
        .replace(/(^#{1,6} .*\\<[^>]+)>/gm, "$1\\>")

      const stripMetaProcessor = unified()
        .use(remarkParse)
        .use(remarkExtractMeta, {})
        .use(remarkStringify)
      const strippedContent = String(
        await stripMetaProcessor.process(rawContent),
      )

      const title = frontmatter.title || pageInfo.name

      return {
        content: strippedContent.trim(),
        frontmatter,
        rawContent: rawContent.trim(),
        sectionAst,
        title,
        url: pageInfo.url,
      }
    } catch (error) {
      console.error(`Error processing component ${pageInfo.name}:`, error)
      throw error
    }
  }

  private generateLlmsTxt(pages: Array<ProcessedPage>): string {
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
    pages: KnowledgePageData[],
  ): Promise<void> {
    const llmsTxtContent = this.generateLlmsTxt(processedPages)
    await mkdir(dirname(this.config.outputPath), {recursive: true}).catch(
      () => {},
    )
    await writeFile(this.config.outputPath, llmsTxtContent, "utf-8")
    const outputStats = await stat(this.config.outputPath)
    const outputSizeKb = (outputStats.size / 1024).toFixed(1)
    console.log(
      `Generated ${this.config.outputPath} with ${pages.length} files(s) at: ${this.config.outputPath}`,
    )
    console.log(`File size: ${outputSizeKb} KB`)
  }

  private async generateExtraFiles(metadata: [string, string][]): Promise<{
    count: number
    duration: number
    entries: ManifestEntry[]
    totalSize: number
  }> {
    const start = performance.now()
    const extraFiles = this.config.extraFiles ?? []
    if (extraFiles.length === 0) {
      return {count: 0, duration: 0, entries: [], totalSize: 0}
    }

    let totalSize = 0
    const entries: ManifestEntry[] = []

    await Promise.all(
      extraFiles.map(async (extraFile) => {
        let contents = extraFile.contents
        if (extraFile.processAsMdx) {
          const removeJsxProcessor = unified()
            .use(remarkParse)
            .use(remarkMdx)
            .use(remarkFrontmatter, ["yaml"])
            .use(remarkRemoveJsx)
            .use(this.transformRelativeUrls())
            .use(remarkStringify)

          contents = String(await removeJsxProcessor.process(contents))
        }

        const lines: string[] = []
        if (metadata.length) {
          lines.push("---")
          for (const [key, value] of metadata) {
            lines.push(`${key}: ${value}`)
          }
          lines.push("---")
          lines.push("")
        }

        if (extraFile.title) {
          lines.push(`# ${extraFile.title}`)
          lines.push("")
        }
        lines.push(contents)
        lines.push("")

        const fileContent = lines.join("\n")
        const fileName = `${kebabCase(extraFile.id)}.md`
        const outfile = `${resolve(this.config.outputPath)}/${fileName}`
        await writeFile(outfile, fileContent, "utf-8")
        const stats = await stat(outfile)
        totalSize += stats.size / 1024

        entries.push({
          id: extraFile.id,
          md5: computeMd5(fileContent),
          path: fileName,
          size: stats.size,
          title: extraFile.title || extraFile.id,
        })
      }),
    )

    return {
      count: extraFiles.length,
      duration: performance.now() - start,
      entries,
      totalSize,
    }
  }

  private async generatePerPageExports(
    pages: KnowledgePageData[],
    processedPages: ProcessedPage[],
    metadata: [string, string][],
  ): Promise<void> {
    const start = performance.now()
    await mkdir(dirname(this.config.outputPath), {recursive: true}).catch(
      () => {},
    )
    const count = processedPages.length
    let totalSize = 0
    const manifestEntries: ManifestEntry[] = []

    await Promise.all(
      processedPages.map(async (processedPage, index) => {
        const page = pages[index]
        const lines: string[] = []

        const frontmatterEntries: [string, string | string[]][] = []
        if (page.url) {
          frontmatterEntries.push(["url", page.url])
        }
        for (const [key, value] of metadata) {
          frontmatterEntries.push([key, value])
        }
        if (this.config.frontmatter?.include?.length) {
          const includePatterns = this.config.frontmatter.include
          const excludePatterns = this.config.frontmatter.exclude ?? []

          for (const [field, value] of Object.entries(
            processedPage.frontmatter,
          )) {
            if (value === undefined) {
              continue
            }
            const isIncluded = includePatterns.some((pattern) =>
              minimatch(field, pattern),
            )
            const isExcluded = excludePatterns.some((pattern) =>
              minimatch(field, pattern),
            )
            if (isIncluded && !isExcluded) {
              frontmatterEntries.push([
                field,
                Array.isArray(value) ? value : String(value),
              ])
            }
          }
        }

        if (this.config.frontmatter?.extraFields) {
          for (const [key, value] of Object.entries(
            this.config.frontmatter.extraFields,
          )) {
            frontmatterEntries.push([key, value])
          }
        }

        if (frontmatterEntries.length > 0) {
          lines.push("---")
          for (const [key, value] of frontmatterEntries) {
            if (Array.isArray(value)) {
              lines.push(`${key}: [${value.join(", ")}]`)
            } else {
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
        // Remove duplicate h1 if content starts with the same title
        content = content.replace(
          new RegExp(`^# ${processedPage.title}\\n+`, ""),
          "",
        )
        if (this.config.pageTitlePrefix) {
          content = content.replace(
            `# ${page.name}`,
            `# ${this.config.pageTitlePrefix} ${page.name}`,
          )
          page.name = `${this.config.pageTitlePrefix} ${page.name}`
        }
        lines.push(content)
        lines.push("")

        const fileContent = lines.join("\n")
        const fileName = `${kebabCase(page.id || page.name)}.md`
        const outfile = `${resolve(this.config.outputPath)}/${fileName}`
        await writeFile(outfile, fileContent, "utf-8")
        const stats = await stat(outfile)
        totalSize += stats.size / 1024

        manifestEntries.push({
          id: page.id || kebabCase(page.name),
          md5: computeMd5(fileContent),
          path: fileName,
          size: stats.size,
          title: processedPage.title,
          url: page.url,
        })
      }),
    )

    const extraFilesResult = await this.generateExtraFiles(metadata)
    manifestEntries.push(...extraFilesResult.entries)

    if (this.config.manifestOutputPath) {
      if (this.config.generateManifest !== false) {
        await this.generateManifest(
          this.config.manifestOutputPath,
          manifestEntries,
        )
      }

      if (this.config.generateBulkZip !== false) {
        await this.generateBulkZip(
          this.config.manifestOutputPath,
          manifestEntries,
        )
      }

      // Generate sections.json (always enabled when exports are enabled)
      await this.generateSectionsOutput(
        processedPages,
        pages,
        this.config.manifestOutputPath,
      )
    }

    console.log(
      `Generated ${count + extraFilesResult.count} files(s) in ${chalk.magenta.bold(`${Math.round(performance.now() - start + extraFilesResult.duration)}ms`)} at ${chalk.blue.bold(this.config.outputPath)} - ${(totalSize + extraFilesResult.totalSize).toFixed(1)} KB`,
    )
  }

  private computeAggregateHash(entries: ManifestEntry[]): string {
    const sortedHashes = entries
      .map((e) => e.md5)
      .sort()
      .join("")
    return computeMd5(sortedHashes)
  }

  private async generateManifest(
    outputPath: string,
    entries: ManifestEntry[],
  ): Promise<ExportManifest> {
    const aggregateHash = this.computeAggregateHash(entries)
    const totalSize = entries.reduce((sum, e) => sum + e.size, 0)

    const manifest: ExportManifest = {
      aggregateHash,
      baseUrl: this.config.baseUrl,
      files: entries,
      generatedAt: new Date().toISOString(),
      totalFiles: entries.length,
      totalSize,
      version: 1,
    }

    await mkdir(outputPath, {recursive: true}).catch(() => {})
    await writeFile(
      join(outputPath, "manifest.json"),
      JSON.stringify(manifest, null, 2),
      "utf-8",
    )

    return manifest
  }

  private async generateBulkZip(
    outputPath: string,
    entries: ManifestEntry[],
  ): Promise<void> {
    await mkdir(outputPath, {recursive: true}).catch(() => {})
    const zipPath = join(outputPath, "bulk.zip")
    const zip = new AdmZip()

    for (const entry of entries) {
      const filePath = join(this.config.outputPath, entry.path)
      const content = await readFile(filePath)
      zip.addFile(entry.path, content)
    }

    zip.writeZip(zipPath)
  }

  private async generateSectionsOutput(
    processedPages: ProcessedPage[],
    pages: KnowledgePageData[],
    outputPath: string,
  ): Promise<void> {
    const sectionsConfig = this.config.sections ?? {}
    const extractor = new SectionExtractor({
      depths: sectionsConfig.depths,
      minContentLength: sectionsConfig.minContentLength,
    })

    const allSections: SectionEntry[] = []

    for (let i = 0; i < processedPages.length; i++) {
      const processed = processedPages[i]
      const page = pages[i]

      const filteredFrontmatter = this.filterFrontmatter(processed.frontmatter)

      const pageSections = extractor.extract(processed.sectionAst, {
        frontmatter: filteredFrontmatter,
        id: page.id,
        title: processed.title,
        url: processed.url,
      })

      allSections.push(...pageSections)
    }

    const output: KnowledgeSections = {
      generatedAt: new Date().toISOString(),
      sections: allSections,
      totalSections: allSections.length,
      version: 1,
    }

    const sectionsPath = join(
      outputPath,
      sectionsConfig.outputPath ?? "sections.json",
    )
    await mkdir(dirname(sectionsPath), {recursive: true}).catch(() => {})
    await writeFile(sectionsPath, JSON.stringify(output, null, 2), "utf-8")

    if (this.config.verbose) {
      console.log(
        `Generated ${allSections.length} sections at ${chalk.blue.bold(sectionsPath)}`,
      )
    }
  }
}
