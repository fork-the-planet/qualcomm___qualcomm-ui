// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {existsSync} from "node:fs"
import {join, resolve} from "node:path"

import {ConfigLoader} from "../docs-plugin/internal"
import type {
  KnowledgeEnvironment,
  KnowledgeIntegrationConfig,
  OpenWebUiIntegration,
} from "../docs-plugin/types"

import type {CliConfig, WebUiKnowledgeConfig} from "./types"

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
): WebUiKnowledgeConfig {
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
): WebUiKnowledgeConfig[] {
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

  if (!environments || Object.keys(environments).length === 0) {
    const legacyConfig = loadKnowledgeConfigFromEnv(
      (options.cliOptions as CliConfig) ?? {outputMode: "per-page"},
    )
    return [legacyConfig]
  }

  let envEntries = Object.entries(environments)
  if (options.environments?.length) {
    const filterSet = new Set(options.environments)
    envEntries = envEntries.filter(([name]) => filterSet.has(name))
  }

  if (envEntries.length === 0) {
    throw new Error(
      `No matching environments found. Available: ${Object.keys(environments).join(", ")}`,
    )
  }

  return envEntries.map(([envName, envConfig]) => {
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
      environmentName: envName,
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

  if (!integrations || Object.keys(integrations).length === 0) {
    return []
  }

  let integrationEntries = Object.entries(integrations)

  if (options.integrations?.length) {
    const filterSet = new Set(options.integrations)
    integrationEntries = integrationEntries.filter(([name]) =>
      filterSet.has(name),
    )
  }

  if (options.environments?.length) {
    const filterSet = new Set(options.environments)
    integrationEntries = integrationEntries.filter(([, config]) =>
      filterSet.has(config.environment),
    )
  }

  return integrationEntries.map(([name, integration]) => {
    const envConfig = environments?.[integration.environment]
    if (!envConfig) {
      throw new Error(
        `Integration "${name}" references unknown environment "${integration.environment}". ` +
          `Available environments: ${Object.keys(environments ?? {}).join(", ") || "none"}`,
      )
    }

    return {
      integration,
      name,
      outputPath: envConfig.outputPath,
    }
  })
}
