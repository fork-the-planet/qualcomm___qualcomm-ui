// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import {config} from "dotenv"

import type {OpenWebUiIntegration} from "../docs-plugin/types"

import type {GlobalCliOpts, ResolvedOpenWebUiIntegration} from "./types"

export function loadEnv() {
  const options: GlobalCliOpts = program.optsWithGlobals()
  if (options.env) {
    config({path: options.env})
  } else {
    config()
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
  const openWebUiUrl = process.env.WEB_UI_URL
  const openWebUiKey = process.env.WEB_UI_KEY
  const knowledgeId = process.env.KNOWLEDGE_ID

  if (!openWebUiUrl || !openWebUiKey || !knowledgeId) {
    throw new Error("WEB_UI_URL, WEB_UI_KEY, and KNOWLEDGE_ID must be set")
  }
  return {
    knowledgeId,
    webUiKey: openWebUiKey,
    webUiUrl: openWebUiUrl,
  }
}

export interface OpenWebUiCredentials {
  apiKey: string
  knowledgeId: string
  url: string
}

/**
 * Loads OpenWebUI credentials for an integration.
 *
 * Convention: `environment: "dev"` loads `.env.dev` unless `envFile` is specified.
 * If the env file doesn't exist (common in CI), dotenv silently skips it and
 * uses env vars already set in the process.
 *
 * Reads from OPEN_WEB_UI_* env vars, with fallback to legacy WEB_UI_* vars.
 */
export function loadOpenWebUiEnv(
  integration: OpenWebUiIntegration,
  integrationName: string,
): OpenWebUiCredentials {
  const envFilePath = integration.envFile ?? `.env.${integration.environment}`
  config({override: true, path: envFilePath})

  const url = process.env.OPEN_WEB_UI_URL ?? process.env.WEB_UI_URL
  const apiKey = process.env.OPEN_WEB_UI_API_KEY ?? process.env.WEB_UI_KEY
  const knowledgeId =
    process.env.OPEN_WEB_UI_KNOWLEDGE_ID ?? process.env.KNOWLEDGE_ID

  if (!url) {
    throw new Error(
      `Missing OPEN_WEB_UI_URL for integration "${integrationName}" ` +
        `(env file: ${envFilePath})`,
    )
  }
  if (!apiKey) {
    throw new Error(
      `Missing OPEN_WEB_UI_API_KEY for integration "${integrationName}" ` +
        `(env file: ${envFilePath})`,
    )
  }
  if (!knowledgeId) {
    throw new Error(
      `Missing OPEN_WEB_UI_KNOWLEDGE_ID for integration "${integrationName}" ` +
        `(env file: ${envFilePath})`,
    )
  }

  return {apiKey, knowledgeId, url}
}

/**
 * Resolves a full OpenWebUI integration config with credentials loaded.
 */
export function resolveOpenWebUiIntegration(
  name: string,
  integration: OpenWebUiIntegration,
  outputPath: string,
): ResolvedOpenWebUiIntegration {
  const credentials = loadOpenWebUiEnv(integration, name)

  return {
    apiKey: credentials.apiKey,
    environment: integration.environment,
    knowledgeId: credentials.knowledgeId,
    name,
    outputPath,
    url: credentials.url,
  }
}
