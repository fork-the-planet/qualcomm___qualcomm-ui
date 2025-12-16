// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {existsSync} from "node:fs"
import {join, resolve} from "node:path"

import {ConfigLoader} from "../docs-plugin/internal"

import type {CliConfig, WebUiKnowledgeConfig} from "./types"

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
