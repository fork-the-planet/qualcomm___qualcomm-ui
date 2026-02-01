// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {existsSync} from "node:fs"
import {join, resolve} from "node:path"

import type {
  KnowledgeEnvironment,
  KnowledgeIntegrationConfig,
  OpenWebUiIntegration,
} from "../docs-plugin"
import {ConfigLoader} from "../docs-plugin/internal"

import type {AiKnowledgeConfig, CliConfig} from "./types"

interface LoadEnvironmentConfigsOptions {
  /** CLI options that override config */
  cliOptions?: Partial<CliConfig>
  /** Filter to specific environment names */
  environments?: string[]
}

interface LoadOpenWebUiIntegrationsOptions {
  /** Filter to integrations referencing specific environments */
  environments?: string[]
  /** Filter to specific integration names */
  integrations?: string[]
}

function parseCliMetadata(
  cliMetadata: string[] | undefined,
): Record<string, string> | undefined {
  if (!cliMetadata?.length) {
    return undefined
  }
  return Object.fromEntries(cliMetadata.map((entry) => entry.split("=")))
}

export function loadKnowledgeConfigFromEnv(
  options: CliConfig,
): AiKnowledgeConfig {
  const configLoader = new ConfigLoader({})
  const resolvedConfig = configLoader.loadConfig()
  const fileConfig = resolvedConfig.knowledge?.global

  const exclude =
    (options.exclude?.length ? options.exclude : undefined) ??
    fileConfig?.exclude ??
    (process.env.FILE_EXCLUDE_PATTERN ?? "").split(",").filter(Boolean)

  const outputPath =
    options.outputPath ??
    fileConfig?.outputPath ??
    process.env.KNOWLEDGE_OUTPUT_PATH

  if (!outputPath) {
    throw new Error("Missing required outputPath")
  }

  const routeDir = join(
    resolvedConfig.appDirectory,
    resolvedConfig.pageDirectory,
  )

  if (!existsSync(resolve(routeDir))) {
    throw new Error(`Route directory ${routeDir} does not exist`)
  }

  const cliMetadata = parseCliMetadata(options.metadata)
  const mergedMetadata =
    fileConfig?.metadata || cliMetadata
      ? {...fileConfig?.metadata, ...cliMetadata}
      : undefined

  return {
    ...fileConfig,
    ...options,
    baseUrl:
      options.baseUrl ?? fileConfig?.baseUrl ?? process.env.DOCS_SITE_BASE_URL,
    docPropsPath: resolvedConfig.typeDocProps,
    exclude,
    extraFiles: fileConfig?.extraFiles,
    metadata: mergedMetadata,
    outputPath,
    pageTitlePrefix:
      options.pageTitlePrefix ??
      fileConfig?.pageTitlePrefix ??
      process.env.PAGE_TITLE_PREFIX,
    routeDir,
  }
}

/**
 * Merges global config with environment-specific overrides.
 */
function mergeEnvironmentConfig(
  global: KnowledgeIntegrationConfig | undefined,
  environment: KnowledgeEnvironment,
): KnowledgeEnvironment {
  return {
    ...global,
    ...environment,
    extraFiles: environment.extraFiles ?? global?.extraFiles,
    metadata:
      global?.metadata || environment.metadata
        ? {...global?.metadata, ...environment.metadata}
        : undefined,
  }
}

/**
 * Loads environment configurations for knowledge generation.
 * If environments are defined in config, returns merged configs for each.
 * Otherwise falls back to legacy single-environment behavior.
 */
export function loadEnvironmentConfigs(
  options: LoadEnvironmentConfigsOptions = {},
): AiKnowledgeConfig[] {
  const configLoader = new ConfigLoader({})
  const resolvedConfig = configLoader.loadConfig()
  const knowledgeConfig = resolvedConfig.knowledge
  const globalConfig = knowledgeConfig?.global
  const environments = knowledgeConfig?.environments

  const routeDir = join(
    resolvedConfig.appDirectory,
    resolvedConfig.pageDirectory,
  )

  if (!existsSync(resolve(routeDir))) {
    throw new Error(`Route directory ${routeDir} does not exist`)
  }

  // Use legacy single-config mode if no environments defined OR if CLI provides
  // an explicit output path (e.g., aggregated mode to a single file)
  if (
    !environments ||
    environments.length === 0 ||
    options.cliOptions?.outputPath
  ) {
    const legacyConfig = loadKnowledgeConfigFromEnv(
      (options.cliOptions as CliConfig) ?? {outputMode: "per-page"},
    )
    return [legacyConfig]
  }

  let filteredEnvironments = environments
  if (options.environments?.length) {
    const filterSet = new Set(options.environments)
    filteredEnvironments = environments.filter((env) => filterSet.has(env.id))
  }

  if (filteredEnvironments.length === 0) {
    throw new Error(
      `No matching environments found. Available: ${environments.map((e) => e.id).join(", ")}`,
    )
  }

  return filteredEnvironments.map((envConfig) => {
    const merged = mergeEnvironmentConfig(globalConfig, envConfig)
    const cliOpts = options.cliOptions

    const cliMetadata = parseCliMetadata(cliOpts?.metadata)
    const mergedMetadata =
      merged.metadata || cliMetadata
        ? {...merged.metadata, ...cliMetadata}
        : undefined

    return {
      ...merged,
      ...cliOpts,
      baseUrl:
        cliOpts?.baseUrl ?? merged.baseUrl ?? process.env.DOCS_SITE_BASE_URL,
      docPropsPath: resolvedConfig.typeDocProps,
      environmentName: envConfig.id,
      exclude:
        (cliOpts?.exclude?.length ? cliOpts.exclude : undefined) ??
        merged.exclude ??
        (process.env.FILE_EXCLUDE_PATTERN ?? "").split(",").filter(Boolean),
      extraFiles: merged.extraFiles,
      metadata: mergedMetadata,
      outputMode: cliOpts?.outputMode ?? merged.outputMode ?? "per-page",
      outputPath: merged.outputPath,
      pageTitlePrefix:
        cliOpts?.pageTitlePrefix ??
        merged.pageTitlePrefix ??
        process.env.PAGE_TITLE_PREFIX,
      routeDir,
    }
  })
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
