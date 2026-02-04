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
  props?: string[]
  type?: string
}

/**
 * A single section entry extracted from documentation.
 */
export interface SectionEntry {
  /**
   * Code examples extracted from this section.
   */
  codeExamples?: CodeExample[]

  /**
   * Prose content with code blocks removed. Used for formatted output.
   */
  content: string

  /**
   * Hash of this section's contents. Includes {@link codeExamples}, {@link
   * metadata}, {@link headerPath}, and {@link rawContent}.
   */
  hash: string

  /**
   * Breadcrumb path of headers leading to this section.
   * @example ["Button", "Examples", "Variants"]
   */
  headerPath: string[]

  /**
   * Metadata extracted from ::: meta ::: blocks within this section.
   */
  metadata?: SectionMetadata

  /**
   * Frontmatter from the source page.
   */
  pageFrontmatter?: Record<string, unknown>

  /**
   * Source page identifier.
   */
  pageId: string

  /**
   * Raw markdown content from the AST, including code blocks.
   */
  rawContent: string

  /**
   * Generated section ID for anchor links.
   * @example "button-examples-variants"
   */
  sectionId: string

  /**
   * URL with anchor to this specific section.
   */
  url?: string
}

/**
 * Output structure for the sections.json export.
 */
export interface KnowledgeSections {
  generatedAt: string
  hash: string
  sections: SectionEntry[]
  totalSections: number
  version: 1
}
