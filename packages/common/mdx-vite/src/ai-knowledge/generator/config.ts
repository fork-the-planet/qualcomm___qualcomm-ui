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
