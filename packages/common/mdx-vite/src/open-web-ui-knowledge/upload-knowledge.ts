// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import {createHash} from "node:crypto"
import {access, readdir, readFile, stat} from "node:fs/promises"
import {resolve} from "node:path"
import {setTimeout} from "node:timers/promises"
import ora from "ora"

import {
  getConfigFromEnv,
  KnowledgeApi,
  loadEnv,
  type SharedConfig,
} from "./common"

interface Config extends SharedConfig {
  force: boolean
  knowledgeFilePath: string
}

/**
 * Calculates the MD5 checksum of a file.
 */
function calculateFileHash(fileData: string) {
  const normalized = fileData
    .normalize("NFC") // Normalize Unicode to canonical form
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n+$/, "") // Remove trailing newline
  return createHash("sha256").update(normalized).digest("hex")
}

interface UploadResult {
  response?: Record<string, string>
  skipped?: boolean
  success: boolean
}

interface KnowledgeFile {
  id: string
  meta: {name: string}
}

class Uploader {
  private config: Config
  readonly api: KnowledgeApi
  private fileHashCache: Map<string, string> = new Map()
  private knowledgeFilesCache: KnowledgeFile[] | null = null

  constructor(config: Config) {
    this.config = config
    this.api = new KnowledgeApi(config)
  }

  private async buildHashCache(files: KnowledgeFile[]): Promise<void> {
    const results = await Promise.allSettled(
      files.map(async (f) => {
        const data = await this.api.downloadFile(f.id)
        if (data) {
          this.fileHashCache.set(f.id, calculateFileHash(data))
        }
      }),
    )
    const failures = results.filter((r) => r.status === "rejected")
    if (failures.length > 0) {
      console.warn(`Failed to cache ${failures.length} file hashes`)
    }
  }

  private async waitForFileDeletion(
    fileId: string,
    maxAttempts = 15,
  ): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
      this.knowledgeFilesCache = null
      const knowledge = await this.api.listKnowledgeFiles()
      const stillExists = (knowledge.files ?? []).some((f) => f.id === fileId)
      if (!stillExists) {
        this.fileHashCache.delete(fileId)
        return true
      }
      await setTimeout(100 * (i + 1))
    }
    console.warn(`File ${fileId} may not have been fully deleted`)
    return false
  }

  private async uploadWithRetry(
    name: string,
    contents: string,
    maxRetries = 6,
  ): Promise<UploadResult> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const result = await this.uploadFile(name, contents)

      if (result.success) {
        return result
      }

      if (result.response?.detail?.includes("Duplicate content detected")) {
        console.warn(
          `Duplicate content: ${name} is already in knowledge base, skipping`,
        )
        return {skipped: true, success: true}
      }

      if (attempt < maxRetries - 1) {
        const delay = 100 * Math.pow(2, attempt)
        console.debug(
          `Retrying ${name} in ${delay}ms (attempt ${attempt + 2}/${maxRetries})`,
        )
        await setTimeout(delay)
      }
    }
    console.debug(`Failed to upload ${name}`)
    return {success: false}
  }

  get headers() {
    return {
      Authorization: `Bearer ${this.config.webUiKey}`,
    }
  }

  private async uploadDirectory() {
    const fileNames = await readdir(this.config.knowledgeFilePath)
    const files = await Promise.all(
      fileNames.map(async (name) => ({
        contents: await readFile(
          resolve(this.config.knowledgeFilePath, name),
          "utf-8",
        ),
        name,
      })),
    )

    const knowledge = await this.api.listKnowledgeFiles()
    this.knowledgeFilesCache = knowledge.files ?? []
    await this.buildHashCache(this.knowledgeFilesCache)

    let skippedCount = 0
    let successCount = 0
    let failureCount = 0

    for (const file of files) {
      const result = await this.uploadWithRetry(file.name, file.contents)
      if (result.skipped) {
        skippedCount++
      } else if (result.success) {
        successCount++
      } else {
        failureCount++
      }
    }

    if (skippedCount > 0) {
      console.debug(
        `Skipped uploading ${skippedCount} files because their contents did not change`,
      )
    }
    const uploadCount = Math.abs(successCount)
    if (uploadCount) {
      console.debug(`Successfully uploaded ${uploadCount} files`)
    }
    if (failureCount > 0) {
      console.debug(`Failed to upload ${failureCount} files`)
    }
  }

  private async uploadFile(
    name: string,
    contents: string,
  ): Promise<UploadResult> {
    const knowledgeFiles = this.knowledgeFilesCache ?? []
    const knowledgeFile = knowledgeFiles.find((f) => f.meta.name === name)
    const contentHash = calculateFileHash(contents)

    if (knowledgeFile && !this.config.force) {
      const existingHash = this.fileHashCache.get(knowledgeFile.id)
      if (existingHash === contentHash) {
        return {skipped: true, success: true}
      }
    }

    if (knowledgeFile) {
      await this.api.removeKnowledgeFile(knowledgeFile.id)
      console.log(`File changed, removed old file: ${name}`)
      await this.waitForFileDeletion(knowledgeFile.id)
    }

    const spinner = ora(`Uploading ${name}`).start()
    const fileBuffer = await readFile(
      resolve(this.config.knowledgeFilePath, name),
    )

    const uploadResponse = await this.api.uploadFile(fileBuffer, name)

    if (!uploadResponse.id || !uploadResponse.filename) {
      spinner.fail(`Error uploading ${name}`)
      return {response: uploadResponse, success: false}
    }

    spinner.text = `Associating ${name} with knowledge base`

    const addResponse = await this.api.associateFile(uploadResponse.id)

    if (addResponse.name) {
      spinner.succeed(`${name} associated with knowledge base`)
      this.fileHashCache.set(uploadResponse.id, contentHash)
      return {success: true}
    } else {
      spinner.stop()
      return {response: addResponse, success: false}
    }
  }

  async uploadKnowledge() {
    const resolvedPath = resolve(this.config.knowledgeFilePath)
    if (
      !(await access(resolvedPath)
        .then(() => true)
        .catch(() => false))
    ) {
      throw new Error(`File or folder not found at ${resolvedPath}`)
    }
    const stats = await stat(resolvedPath)
    if (stats.isDirectory()) {
      return this.uploadDirectory()
    } else {
      // TODO: add
    }
  }
}

export function addUploadKnowledgeCommand() {
  program
    .name("upload-knowledge")
    .description("Upload files to OpenWebUI knowledge base")
    .command("upload-knowledge")
    .option("-p, --path <path>", "Path to file or folder relative to script")
    .option(
      "--force",
      "force upload files, even if their contents have not changed",
    )
    .action(async (options) => {
      loadEnv()

      const sharedConfig = getConfigFromEnv()

      const knowledgeFilePath =
        options.path || process.env.KNOWLEDGE_OUTPUT_PATH

      if (!knowledgeFilePath) {
        throw new Error(
          "KNOWLEDGE_FILE_PATH must be set or provided as the --path option",
        )
      }

      const uploader = new Uploader({
        ...sharedConfig,
        force: options.force || false,
        knowledgeFilePath,
      })

      return uploader.uploadKnowledge()
    })
}
