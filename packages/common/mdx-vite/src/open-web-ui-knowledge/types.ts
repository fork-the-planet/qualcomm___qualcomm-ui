// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  KnowledgeExtraFile,
  KnowledgeIntegrationConfig,
} from "../docs-plugin/types"

export interface WebUiKnowledgeConfig extends KnowledgeIntegrationConfig {
  clean?: boolean
  docPropsPath?: string
  /**
   * Name of the environment being processed (for logging/tracking).
   */
  environmentName?: string
  extraFiles?: KnowledgeExtraFile[]
  /**
   * Generate bulk.zip containing all markdown files.
   */
  generateBulkZip?: boolean
  /**
   * Generate manifest.json with file metadata and MD5 hashes.
   */
  generateManifest?: boolean
  /**
   * Output directory for manifest.json and bulk.zip.
   */
  manifestOutputPath?: string
  outputMode: "per-page" | "aggregated"
  outputPath: string
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
