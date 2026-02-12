// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {config} from "dotenv"

import type {OpenWebUiIntegration} from "../../docs-plugin"
import {ConfigLoader} from "../../docs-plugin/internal"

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

interface LoadOpenWebUiIntegrationsOptions {
  /** Filter to integrations referencing specific environments */
  environments?: string[]
  /** Filter to specific integration names */
  integrations?: string[]
}

/**
 * Loads OpenWebUI integration configurations for upload operations.
 * Returns resolved integrations with environment output paths.
 */
export function loadOpenWebUiIntegrations(
  options: LoadOpenWebUiIntegrationsOptions = {},
): Array<{
  integration: OpenWebUiIntegration
  name: string
  outputPath: string
}> {
  const configLoader = new ConfigLoader({})
  const resolvedConfig = configLoader.loadConfig()
  const knowledgeConfig = resolvedConfig.knowledge
  const environments = knowledgeConfig?.environments
  const integrations = knowledgeConfig?.integrations?.openWebUi

  if (!integrations || integrations.length === 0) {
    return []
  }

  let filteredIntegrations = integrations

  if (options.integrations?.length) {
    const filterSet = new Set(options.integrations)
    filteredIntegrations = integrations.filter((integration) =>
      filterSet.has(integration.id),
    )
  }

  if (options.environments?.length) {
    const filterSet = new Set(options.environments)
    filteredIntegrations = filteredIntegrations.filter((integration) =>
      filterSet.has(integration.id),
    )
  }

  return filteredIntegrations.map((integration) => {
    const envConfig = environments?.find((e) => e.id === integration.id)
    if (!envConfig) {
      throw new Error(
        `Integration "${integration.id}" references unknown environment "${integration.id}". ` +
          `Available environments: ${environments?.map((e) => e.id).join(", ") || "none"}`,
      )
    }

    return {
      integration,
      name: integration.id,
      outputPath: envConfig.outputPath,
    }
  })
}
