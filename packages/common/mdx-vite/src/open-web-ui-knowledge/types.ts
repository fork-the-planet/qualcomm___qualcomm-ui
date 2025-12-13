// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {KnowledgeIntegrationConfig} from "../docs-plugin/types"

export interface WebUiKnowledgeConfig extends KnowledgeIntegrationConfig {
  clean?: boolean
  docPropsPath?: string
  outputMode: "per-page" | "aggregated"
  outputPath: string
  routeDir: string
  verbose?: boolean
}

export interface CliConfig
  extends Omit<
    WebUiKnowledgeConfig,
    "docPropsPath" | "outputPath" | "routeDir"
  > {
  envFilePath?: string
  outputPath?: string
}

export interface GlobalCliOpts {
  env?: string
}
