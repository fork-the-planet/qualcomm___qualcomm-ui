// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import {execSync} from "node:child_process"
import {createHash} from "node:crypto"
import {readFileSync} from "node:fs"
import {relative} from "node:path"
import remarkFrontmatter from "remark-frontmatter"
import remarkParse from "remark-parse"
import remarkParseFrontmatter from "remark-parse-frontmatter"
import remarkStringify from "remark-stringify"
import {unified} from "unified"

import type {PageFrontmatter} from "@qualcomm-ui/mdx-common"
import type {QuiPropTypes} from "@qualcomm-ui/typedoc-common"

import type {PageTimestampMetadataMode} from "../../../types"
import {frontmatterSchema} from "../../utils"

import type {IndexedPage, IndexedSection} from "./markdown.types"

export interface GitMetadata {
  updatedBy?: string
  updatedOn?: string
}

function getRepoRoot(): string {
  return execSync("git rev-parse --show-toplevel", {
    encoding: "utf-8",
  }).trim()
}

/**
 * Gets the last git commit metadata for a file.
 * Returns undefined values if the file is not tracked by git or if git is
 * unavailable.
 */
export function getGitMetadata(
  filePath: string,
  mode: PageTimestampMetadataMode,
): GitMetadata {
  if (mode === "off") {
    return {}
  }

  try {
    const repoRoot = getRepoRoot()
    const relativePath = relative(repoRoot, filePath)
    const format = mode === "user-and-timestamp" ? "%cI%n%aN" : "%cI"
    const result = execSync(
      `git log -1 --format=${format} -- "${relativePath}"`,
      {
        cwd: repoRoot,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      },
    ).trim()

    if (!result) {
      return {}
    }

    if (mode === "user-and-timestamp") {
      const [updatedOn, updatedBy] = result.split("\n")
      return {updatedBy, updatedOn}
    }

    return {updatedOn: result}
  } catch {
    return {}
  }
}

interface PageCache {
  frontmatter: PageFrontmatter
  md5: string
  page: IndexedPage
  pageDocProps: Record<string, QuiPropTypes>
  pageDocPropSections: IndexedSection[]
}

export class MarkdownFileReader {
  cachedFileCount = 0
  logWarnings = true
  private mdxCache: Record<string, PageCache> = {}

  constructor(
    public enabled: boolean,
    public pageTimestampMetadata: PageTimestampMetadataMode = "off",
  ) {}

  private hash(input: string) {
    return createHash("md5").update(input).digest("hex")
  }

  reset(): void {
    this.cachedFileCount = 0
  }

  readCache(filePath: string): PageCache | null {
    return this.mdxCache[filePath] || null
  }

  private checkCache(
    filePath: string,
    fileContents: string,
  ): Omit<PageCache, "md5"> | undefined {
    if (!this.enabled) {
      return
    }

    const fileMd5 = this.hash(fileContents)
    const cached = this.mdxCache[filePath]

    if (cached?.md5 !== fileMd5) {
      return
    }

    this.cachedFileCount++

    return {
      frontmatter: cached.frontmatter,
      page: cached.page,
      pageDocProps: cached.pageDocProps,
      pageDocPropSections: cached.pageDocPropSections,
    }
  }

  readFile(filepath: string): {
    cached: Omit<PageCache, "md5"> | undefined
    fileContents: string
    frontmatter: PageFrontmatter
  } {
    const fileContents = readFileSync(filepath, "utf-8")

    const cached = this.checkCache(filepath, fileContents)

    let file:
      | {data: {frontmatter: PageFrontmatter}}
      | ReturnType<typeof unified.processSync>
    if (cached?.frontmatter) {
      file = {data: {frontmatter: cached.frontmatter}}
    } else {
      // only parse the yaml section because we just need the frontmatter at this
      // stage.
      const yamlSection = fileContents.substring(
        0,
        fileContents.indexOf("\n---") + 4,
      )
      file = unified()
        .use(remarkParse)
        .use(remarkFrontmatter, ["yaml"])
        .use(remarkParseFrontmatter)
        .use(remarkStringify)
        .processSync(yamlSection)
    }

    const frontmatter: PageFrontmatter = (file.data
      .frontmatter as PageFrontmatter) ?? {title: ""}

    if (!frontmatter.title) {
      const lines = fileContents.split("\n")
      const fallbackTitle = lines.find((line) => line.startsWith("# "))
      if (fallbackTitle) {
        frontmatter.title = fallbackTitle.substring(2).trim()
      }
    }
    // TODO: permit omitting title from frontmatter if provided in the navConfig
    if (!frontmatter.title && this.logWarnings) {
      console.debug(chalk.red.bold("Missing title:"), filepath)
    }

    const parsedFrontmatter = frontmatterSchema.safeParse(frontmatter)

    if (!parsedFrontmatter.success) {
      console.debug(
        `${chalk.redBright.bold("Invalid frontmatter detected for file")}: ${filepath}\n`,
      )
      console.debug(chalk.redBright.bold("Please check the following fields:"))
      parsedFrontmatter.error.issues.map((issue: any) => {
        console.debug(`- ${issue.path.join(".")}`)
      })
    }

    if (!frontmatter.updatedOn || !frontmatter.updatedBy) {
      const gitMetadata = getGitMetadata(filepath, this.pageTimestampMetadata)
      if (!frontmatter.updatedOn && gitMetadata.updatedOn) {
        frontmatter.updatedOn = gitMetadata.updatedOn
      }
      if (!frontmatter.updatedBy && gitMetadata.updatedBy) {
        frontmatter.updatedBy = gitMetadata.updatedBy
      }
    }

    return {cached, fileContents, frontmatter}
  }

  updateCache(
    filepath: string,
    fileContents: string,
    cacheData: Omit<PageCache, "md5">,
  ): void {
    if (this.enabled) {
      this.mdxCache[filepath] = {...cacheData, md5: this.hash(fileContents)}
    }
  }
}
