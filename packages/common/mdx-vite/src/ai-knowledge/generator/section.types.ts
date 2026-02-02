// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * A code example extracted from a section.
 */
export interface CodeExample {
  /**
   * The code content.
   */
  code: string

  /**
   * Programming language from fence info string.
   */
  language: string
}

/**
 * Metadata extracted from ::: meta ::: blocks within a section.
 */
export interface SectionMetadata {
  [key: string]: string | string[] | undefined
  category?: string
  component?: string
  keywords?: string[]
}

/**
 * A single section entry extracted from documentation.
 */
export interface SectionEntry {
  /**
   * Code examples extracted from this section.
   */
  codeExamples: CodeExample[]

  /**
   * Explanatory prose content (code blocks removed).
   */
  content: string

  /**
   * Header depth (1-6).
   */
  depth: number

  /**
   * End character offset in the source markdown (exclusive).
   */
  endOffset: number

  /**
   * Breadcrumb path of headers leading to this section.
   * @example ["Button", "Examples", "Variants"]
   */
  headerPath: string[]

  /**
   * Metadata extracted from ::: meta ::: blocks within this section.
   */
  metadata: SectionMetadata

  /**
   * Source page identifier.
   */
  pageId: string

  /**
   * Full URL to documentation page.
   */
  pageUrl?: string

  /**
   * Generated section ID for anchor links.
   * @example "button-examples-variants"
   */
  sectionId: string

  /**
   * URL with anchor to this specific section.
   */
  sectionUrl?: string

  /**
   * Start character offset in the source markdown.
   */
  startOffset: number

  /**
   * Approximate word count for context window planning.
   */
  wordCount: number
}

/**
 * Output structure for the sections.json export.
 */
export interface KnowledgeSections {
  generatedAt: string
  sections: SectionEntry[]
  totalSections: number
  version: 1
}
