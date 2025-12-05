// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import {config} from "dotenv"

import type {GlobalCliOpts} from "./types"

export function loadEnv() {
  const options: GlobalCliOpts = program.optsWithGlobals()
  console.debug(options)
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
