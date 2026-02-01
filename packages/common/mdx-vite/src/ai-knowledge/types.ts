// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Plugin} from "unified"

import type {
  KnowledgeExtraFile,
  KnowledgeIntegrationConfig,
} from "../docs-plugin"

export interface WebUiKnowledgeConfig extends KnowledgeIntegrationConfig {
  clean?: boolean
  docPropsPath?: string
  /**
   * Name of the environment being processed (for logging/tracking).
   */
  environmentName?: string
  extraFiles?: KnowledgeExtraFile[]
  /**
   * Generate bulk.zip containing all Markdown files.
   *
   * @default true
   */
  generateBulkZip?: boolean
  /**
   * Generate manifest.json with file metadata and MD5 hashes.
   *
   * @default true
   */
  generateManifest?: boolean
  /**
   * Output directory for manifest.json and bulk.zip.
   *
   * @default "exports"
   */
  manifestOutputPath?: string
  outputMode: "per-page" | "aggregated"
  outputPath: string
  /**
   * Array of plugins to apply to MDX files during processing. Can be used to
   * replace JSX components with markdown-friendly data, add metadata, and more.
   */
  plugins?: Plugin[]
  routeDir: string
  verbose?: boolean
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

export interface CliConfig
  extends Omit<
    WebUiKnowledgeConfig,
    "docPropsPath" | "metadata" | "outputPath" | "routeDir"
  > {
  envFilePath?: string
  /**
   * CLI metadata as `key=value` strings.
   */
  metadata?: string[]
  outputPath?: string
}

export interface GlobalCliOpts {
  env?: string
}
