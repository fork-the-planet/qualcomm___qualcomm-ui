// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import {config} from "dotenv"
import {existsSync} from "node:fs"
import {join, resolve} from "node:path"

import type {
  KnowledgeEnvironment,
  KnowledgeIntegrationConfig,
} from "../docs-plugin"
import {ConfigLoader} from "../docs-plugin/internal"

import type {AiKnowledgeConfig, CliConfig, GlobalCliOpts} from "./types"

interface LoadEnvironmentConfigsOptions {
  /** CLI options that override config */
  cliOptions?: Partial<CliConfig>
  /** Filter to specific environment names */
  environments?: string[]
}

export function loadEnv() {
  const options: GlobalCliOpts = program.optsWithGlobals()
  if (options.env) {
    config({path: options.env, quiet: true})
  } else {
    config({quiet: true})
  }
}

export interface SharedConfig {
  knowledgeId: string
  webUiKey: string
  webUiUrl: string
}

/**
 * Gets OpenWebUI credentials from environment variables.
 * Used for legacy single-environment setups.
 */
export function getConfigFromEnv(): SharedConfig {
  const openWebUiUrl = process.env.WEB_UI_URL || process.env.OPEN_WEB_UI_URL
  const openWebUiKey = process.env.WEB_UI_KEY || process.env.OPEN_WEB_UI_API_KEY
  const knowledgeId =
    process.env.KNOWLEDGE_ID || process.env.OPEN_WEB_UI_KNOWLEDGE_ID

  if (!openWebUiUrl || !openWebUiKey || !knowledgeId) {
    throw new Error("WEB_UI_URL, WEB_UI_KEY, and KNOWLEDGE_ID must be set")
  }
  return {
    knowledgeId,
    webUiKey: openWebUiKey,
    webUiUrl: openWebUiUrl,
  }
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
    manifestOutputPath: outputPath,
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
      manifestOutputPath: merged.outputPath,
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
