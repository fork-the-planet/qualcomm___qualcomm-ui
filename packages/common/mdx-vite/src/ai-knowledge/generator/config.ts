// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AiKnowledgeConfig} from "../types"

let currentConfig: AiKnowledgeConfig | null = null

export function setConfig(config: AiKnowledgeConfig) {
  currentConfig = config
}

export function getConfig(): AiKnowledgeConfig {
  if (!currentConfig) {
    throw new Error("Config not initialized")
  }
  return currentConfig
}
