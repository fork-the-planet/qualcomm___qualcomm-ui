// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface SourceCode {
  /**
   * The full source code file.
   */
  full: string

  /**
   * Optional preview, extracted from comment snippets that wrap a section of the
   * code.
   */
  preview?: string | null | undefined
}

export interface SourceCodeData {
  fileName: string
  filePath?: string
  highlighted: SourceCode
  /**
   * Highlighted code with tailwind classes transformed into inline styles and
   * standalone CSS, where applicable.
   */
  highlightedInline?: SourceCode
  /**
   * @deprecated no longer populated. Raw source code data is now added to data-* attributes on the rendered `<pre>` element. The UI can query this for copying code to the clipboard.
   */
  raw?: SourceCode & {
    /**
     * @deprecated no longer populated
     */
    withoutImports?: string | null | undefined
  }
  type: "file" | "residual-css"
}

export interface ReactDemoData {
  demoName: string
  errorMessage?: string
  fileName: string
  filePath: string
  imports: string[]
  pageId: string
  sourceCode: SourceCodeData[]
}

/**
 * @deprecated no longer used
 */
export interface ReactDemoWithScope extends ReactDemoData {
  scope: Record<string, any>
}

export interface PreviewBlock {
  content: string
  endLine: number
  startLine: number
}

export interface AngularDemoInfo {
  componentClass: string
  dimensions?: {
    height: number
  }
  filePath: string
  hasDefaultExport: boolean
  id: string
  imports: string[]
  initialHtml?: string
  isStandalone: boolean
  lastModified: number
  /**
   * @deprecated no longer populated
   */
  pageId?: string | undefined
  selector: string
  sourceCode: SourceCodeData[]
}

export interface PreviewContext {
  content: string
  context: "template" | "typescript"
  endLine: number
  startLine: number
}

export interface ExtractedPreview {
  formattedPreview?: string
  previewBlocks?: PreviewContext[]
  sourceWithoutPreviews: string
}
