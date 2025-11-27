// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export function removeCodeAnnotations(code: string): string {
  const lineAnnotationRegex = /\/\/\s*\[!code\s*(?:\S.*)?\]/
  const jsxBlockAnnotationRegex = /\{\s*\/\*\s*\[!code(?:\s+\S+)?\]\s*\*\/\s*\}/
  const htmlAnnotationRegex = /<!--\s*\[!code(?:\s+\S+)?\]\s*-->/
  const blockAnnotationRegex = /\/\*\s*\[!code(?:\s+\S+)?\]\s*\*\/\s*/ // non-JSX block
  const inlineIncrementRegex = /(?:\/\/\s*)?\[!code \+\+\]/

  function stripAnnotations(line: string): {
    processed: string
    touched: boolean
  } {
    let processed = line
    let touched = false

    const patterns = [
      inlineIncrementRegex,
      jsxBlockAnnotationRegex,
      htmlAnnotationRegex,
      blockAnnotationRegex,
    ]

    for (const pattern of patterns) {
      const next = processed.replace(pattern, "")
      if (next !== processed) {
        touched = true
        processed = next
      }
    }

    return {processed, touched}
  }

  return code
    .split("\n")
    .map(stripAnnotations)
    .filter(({processed, touched}) => {
      if (lineAnnotationRegex.test(processed)) {
        return false
      }

      const processedIsBlank = !processed.trim()
      if (touched && processedIsBlank) {
        return false
      }

      return true
    })
    .map(({processed}) => processed)
    .join("\n")
}
