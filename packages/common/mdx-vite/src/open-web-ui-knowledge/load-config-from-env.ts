// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {existsSync} from "node:fs"
import {join, resolve} from "node:path"

import {ConfigLoader} from "../docs-plugin/internal"

import type {CliConfig, WebUiKnowledgeConfig} from "./types"

export function loadKnowledgeConfigFromEnv(
  options: CliConfig,
): WebUiKnowledgeConfig {
  const configLoader = new ConfigLoader({})
  const resolvedConfig = configLoader.loadConfig()
  const fileConfig = resolvedConfig.knowledge?.owui

  const exclude =
    options.exclude ??
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

  return {
    ...fileConfig,
    ...options,
    baseUrl:
      options.baseUrl ?? fileConfig?.baseUrl ?? process.env.DOCS_SITE_BASE_URL,
    docPropsPath: resolvedConfig.typeDocProps,
    exclude,
    outputPath,
    pageTitlePrefix:
      options.pageTitlePrefix ??
      fileConfig?.pageTitlePrefix ??
      process.env.PAGE_TITLE_PREFIX,
    routeDir,
  }
}
