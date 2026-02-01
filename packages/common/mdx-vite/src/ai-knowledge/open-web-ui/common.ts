import {config} from "dotenv"

import type {OpenWebUiIntegration} from "../../docs-plugin"

export interface OpenWebUiCredentials {
  apiKey: string
  knowledgeId: string
  url: string
}

/**
 * Resolved OpenWebUI integration config ready for upload operations.
 * Contains all credentials loaded from the env file.
 */
export interface ResolvedOpenWebUiIntegration {
  /**
   * API key for authentication.
   */
  apiKey: string
  /**
   * Environment name this integration references.
   */
  environment: string
  /**
   * Knowledge base ID.
   */
  knowledgeId: string
  /**
   * Integration name (key from integrations.openWebUi).
   */
  name: string
  /**
   * Output path from the referenced environment.
   */
  outputPath: string
  /**
   * OpenWebUI instance URL.
   */
  url: string
}

/**
 * Loads OpenWebUI credentials for an integration.
 *
 * Convention: `id: "dev"` loads `.env.dev` unless `envFile` is specified. If the
 * env file doesn't exist (common in CI), dotenv silently skips it and uses env
 * vars already set in the process.
 *
 * Reads from OPEN_WEB_UI_* env vars, with fallback to legacy WEB_UI_* vars.
 */
export function loadOpenWebUiEnv(
  integration: OpenWebUiIntegration,
  integrationName: string,
): OpenWebUiCredentials {
  const envFilePath = integration.envFile ?? `.env.${integration.id}`
  config({override: true, path: envFilePath, quiet: true})

  const url = process.env.OPEN_WEB_UI_URL ?? process.env.WEB_UI_URL
  const apiKey = process.env.OPEN_WEB_UI_API_KEY ?? process.env.WEB_UI_KEY
  const knowledgeId =
    process.env.OPEN_WEB_UI_KNOWLEDGE_ID ?? process.env.KNOWLEDGE_ID

  if (!url) {
    throw new Error(
      `Missing OPEN_WEB_UI_URL for integration "${integrationName}" ` +
        `(env file: ${envFilePath})`,
    )
  }
  if (!apiKey) {
    throw new Error(
      `Missing OPEN_WEB_UI_API_KEY for integration "${integrationName}" ` +
        `(env file: ${envFilePath})`,
    )
  }
  if (!knowledgeId) {
    throw new Error(
      `Missing OPEN_WEB_UI_KNOWLEDGE_ID for integration "${integrationName}" ` +
        `(env file: ${envFilePath})`,
    )
  }

  return {apiKey, knowledgeId, url}
}

/**
 * Resolves a full OpenWebUI integration config with credentials loaded.
 */
export function resolveOpenWebUiIntegration(
  name: string,
  integration: OpenWebUiIntegration,
  outputPath: string,
): ResolvedOpenWebUiIntegration {
  const credentials = loadOpenWebUiEnv(integration, name)

  return {
    apiKey: credentials.apiKey,
    environment: integration.id,
    knowledgeId: credentials.knowledgeId,
    name,
    outputPath,
    url: credentials.url,
  }
}
