// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Plugin} from "unified"

import type {KnowledgePageData} from "@qualcomm-ui/mdx-common"

import type {
  KnowledgeExtraFile,
  KnowledgeIntegrationConfig,
} from "../docs-plugin"

export type KnowledgeMdxPlugin = (opts: KnowledgePageData) => Plugin

export interface AiKnowledgeConfig extends KnowledgeIntegrationConfig {
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
  /**
   * Array of plugins to apply to MDX files during processing. Can be used to
   * replace JSX components with markdown-friendly data, add metadata, and more.
   */
  mdxPlugins?: KnowledgeMdxPlugin[]
  outputMode: "per-page" | "aggregated"
  outputPath: string
  routeDir: string
  verbose?: boolean
}

export interface CliConfig
  extends Omit<
    AiKnowledgeConfig,
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
