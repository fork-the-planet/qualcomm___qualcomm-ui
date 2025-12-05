// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import {mkdir, writeFile} from "node:fs/promises"
import {resolve} from "node:path"

import {FilesApi, KnowledgeApi} from "./api"
import {getConfigFromEnv, loadEnv} from "./common"

export function addDownloadKnowledgeCommand() {
  program
    .command("download-knowledge")
    .description("Download files from an Open Web UI knowledge base")
    .requiredOption("-o, --output-dir <outputDir>", "Folder path")
    .action(async (opts) => {
      loadEnv()

      await mkdir(opts.outputDir, {recursive: true}).catch()

      const config = getConfigFromEnv()
      const apiConfig = {apiKey: config.webUiKey, baseUrl: config.webUiUrl}
      const knowledgeApi = new KnowledgeApi(apiConfig)
      const filesApi = new FilesApi(apiConfig)

      const knowledge = await knowledgeApi.getById(config.knowledgeId)
      for (const file of knowledge.files ?? []) {
        const fileName = file.meta?.name as string | undefined
        if (!fileName) continue

        try {
          const content = await filesApi.getDataContent(file.id)
          if (content?.content) {
            await writeFile(resolve(opts.outputDir, fileName), content.content, "utf-8")
          }
        } catch {
          console.warn(`Failed to download ${fileName}`)
        }
      }
    })
}
