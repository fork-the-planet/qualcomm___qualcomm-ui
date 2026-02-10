// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"

import {addGenerateKnowledgeCommand} from "./ai-knowledge/generator"
import {addDownloadKnowledgeCommand} from "./ai-knowledge/open-web-ui/download-knowledge"
import {addUploadKnowledgeCommand} from "./ai-knowledge/open-web-ui/upload-knowledge"
import {addGeneratePageMapCommand} from "./docs-plugin/generate-page-map"
import {addGenerateLazyDemoMapCommand} from "./react-demo-plugin/generate-lazy-demo-map"

function setupCli() {
  // global options
  program.option("--env <envFile>", "relative path to the env file to use")

  addGenerateKnowledgeCommand()
  addUploadKnowledgeCommand()
  addDownloadKnowledgeCommand()
  addGenerateLazyDemoMapCommand()
  addGeneratePageMapCommand()

  program.parse()
}

setupCli()
