// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  KnowledgeExtraFile,
  KnowledgeIntegrationConfig,
} from "../docs-plugin/types"

export interface WebUiKnowledgeConfig extends KnowledgeIntegrationConfig {
  clean?: boolean
  docPropsPath?: string
  extraFiles?: KnowledgeExtraFile[]
  outputMode: "per-page" | "aggregated"
  outputPath: string
  routeDir: string
  verbose?: boolean
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
