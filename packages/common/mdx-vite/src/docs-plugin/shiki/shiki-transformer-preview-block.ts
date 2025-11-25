// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ShikiTransformer} from "shiki"

import {dedent} from "@qualcomm-ui/utils/dedent"

export type PreviewDisplayMode = "only-preview" | "full-code"

interface PreviewBlockTransformerOptions {
  /**
   * @option 'full-code': keep the full code (with preview markers removed) as the rendered snippet.
   * @option 'preview-only': render only the extracted preview block as the snippet
   *
   * In all cases the preview block is extracted and attached to `data-preview`.
   *
   * @default 'full-code'
   */
  displayMode?: PreviewDisplayMode

  /**
   * Callback fired when file processing is complete.
   */
  onComplete?: (extractedPreview: string | null) => void
}

function isPreviewLine(trimmedLine: string): boolean {
  return (
    trimmedLine === "// preview" ||
    /^\{\s*\/\*\s*preview\s*\*\/\s*\}$/.test(trimmedLine) ||
    /^<!--\s*preview\s*-->$/.test(trimmedLine)
  )
}

export function transformerPreviewBlock(
  options: PreviewBlockTransformerOptions = {
    displayMode: "full-code",
  },
): ShikiTransformer {
  let previewContent: string | null = null

  return {
    enforce: "post",
    name: "transformer-preview-block",
    pre(node) {
      if (previewContent) {
        node.properties["data-preview"] = previewContent
      }
      options.onComplete?.(previewContent || null)
    },
    preprocess(code) {
      previewContent = null
      const lines = code.split("\n")
      const resultLines: string[] = []
      const previewLines: string[] = []
      let inPreview = false
      let foundPreview = false

      for (const line of lines) {
        const trimmed = line.trim()
        if (isPreviewLine(trimmed)) {
          if (!inPreview) {
            inPreview = true
            foundPreview = true
          } else {
            inPreview = false
          }
          continue
        }
        resultLines.push(line)
        if (inPreview) {
          previewLines.push(line)
        }
      }

      if (foundPreview) {
        previewContent = dedent(previewLines.join("\n").trim())
        if (options.displayMode === "only-preview") {
          return previewContent
        }
      }

      return resultLines.join("\n").trim()
    },
  }
}
