// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ApiConfig, FilesApi, KnowledgeApi} from "./api"
import type {SharedConfig} from "./common"

export interface KnowledgeCleanerConfig extends SharedConfig {}

export class KnowledgeCleaner {
  private readonly filesApi: FilesApi
  private readonly knowledgeApi: KnowledgeApi

  constructor(config: KnowledgeCleanerConfig) {
    const apiConfig: ApiConfig = {
      apiKey: config.webUiKey,
      baseUrl: config.webUiUrl,
    }
    this.filesApi = new FilesApi(apiConfig)
    this.knowledgeApi = new KnowledgeApi(apiConfig)
  }

  async cleanUpOrphanedFiles() {
    const files = await this.filesApi.list()
    const knowledgeBases = await this.knowledgeApi.list()
    const knowledgeIds = knowledgeBases.map((k) => k.id)
    for (const file of files) {
      const collectionName = file.meta?.collection_name
      if (collectionName && !knowledgeIds.includes(collectionName)) {
        await this.filesApi.delete(file.id)
      } else if (file.data?.status === "failed") {
        await this.filesApi.delete(file.id)
      }
    }
  }
}
