// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  PageHeading,
  PageSection,
  PageSectionContent,
  RichContentNode,
} from "@qualcomm-ui/mdx-common"

export interface IndexedSection {
  content: PageSectionContent[]
  heading: PageHeading | null
  richContent: RichContentNode[]
}

export interface IndexedPage {
  sections: IndexedSection[]
  toc: PageHeading[]
}

export interface CompiledMdxFileMetadata {
  changed: {
    /**
     * true if the file's frontmatter has changed since the last build.
     */
    frontmatter?: boolean | undefined

    /**
     * true if the file's toc has changed since the last build.
     */
    toc?: boolean | undefined
  }
  filePath: string
}

export interface CompiledMdxFile {
  /**
   * Metadata about the file.
   */
  metadata: CompiledMdxFileMetadata
  pageSections: PageSection[]
}
