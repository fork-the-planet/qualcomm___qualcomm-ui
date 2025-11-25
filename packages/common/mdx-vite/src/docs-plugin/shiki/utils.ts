// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export function removeCodeAnnotations(code: string): string {
  const lineAnnotationRegex = /\/\/\s*\[!code\s*(?:\S.*)?\]/
  const jsxBlockAnnotationRegex = /\{\s*\/\*\s*\[!code(?:\s+\S+)?\]\s*\*\/\s*\}/

  return code
    .split("\n")
    .map((line) => {
      let processed = line
      let touched = false

      const next1 = processed.replace(/(?:\/\/\s*)?\[!code \+\+\]/, "")
      if (next1 !== processed) {
        touched = true
        processed = next1
      }

      const next2 = processed.replace(jsxBlockAnnotationRegex, "")
      if (next2 !== processed) {
        touched = true
        processed = next2
      }

      return {processed, touched}
    })
    .filter(({processed, touched}) => {
      if (lineAnnotationRegex.test(processed)) {
        return false
      }

      const processedIsBlank = !processed.trim()

      // If the line was changed by annotation removal and is now blank, drop it.
      if (touched && processedIsBlank) {
        return false
      }

      // Keep untouched blank lines and all non-blank lines
      return true
    })
    .map(({processed}) => processed)
    .join("\n")
}
