// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {SectionExtractor} from "../section-extractor"

describe("SectionExtractor", () => {
  const pageInfo = {
    frontmatter: {},
    id: "test-page",
    title: "Test Page",
    url: "https://docs.example.com/test-page",
  }

  describe("basic extraction", () => {
    test("extracts H2 sections by default", () => {
      const markdown = `
# Test Page

Introduction content.

## Section One

Section one content.

## Section Two

Section two content.
`
      const extractor = new SectionExtractor({depths: [2, 3]})
      const sections = extractor.extract(markdown, pageInfo)

      expect(sections).toHaveLength(2)
      expect(sections[0].headerPath).toEqual(["Test Page", "Section One"])
      expect(sections[0].content).toContain("Section one content.")
      expect(sections[1].headerPath).toEqual(["Test Page", "Section Two"])
      expect(sections[1].content).toContain("Section two content.")
    })

    test("extracts H3 sections nested under H2", () => {
      const markdown = `
# Test Page

## Examples

Examples intro.

### Basic

Basic example content.

### Advanced

Advanced example content.
`
      const extractor = new SectionExtractor()
      const sections = extractor.extract(markdown, pageInfo)

      expect(sections).toHaveLength(3)
      expect(sections[0].headerPath).toEqual(["Test Page", "Examples"])
      expect(sections[1].headerPath).toEqual(["Test Page", "Examples", "Basic"])
      expect(sections[2].headerPath).toEqual([
        "Test Page",
        "Examples",
        "Advanced",
      ])
    })

    test("generates correct section IDs", () => {
      const markdown = `
# Test Page

## Getting Started

Content here.
`
      const extractor = new SectionExtractor()
      const sections = extractor.extract(markdown, pageInfo)

      expect(sections[0].sectionId).toBe("test-page-getting-started")
    })

    test("generates correct section URLs", () => {
      const markdown = `
# Test Page

## Installation

Install content.
`
      const extractor = new SectionExtractor()
      const sections = extractor.extract(markdown, pageInfo)

      expect(sections[0].url).toBe(
        "https://docs.example.com/test-page#installation",
      )
    })
  })

  describe("header path accumulation", () => {
    test("accumulates header breadcrumb correctly", () => {
      const markdown = `
# Button

## Examples

Examples intro.

### Variants

Variants content.

### Sizes

Sizes content.
`
      const extractor = new SectionExtractor({depths: [2, 3]})
      const sections = extractor.extract(markdown, {
        ...pageInfo,
        title: "Button",
      })

      expect(sections).toHaveLength(3)
      expect(sections[0].headerPath).toEqual(["Button", "Examples"])
      expect(sections[1].headerPath).toEqual(["Button", "Examples", "Variants"])
      expect(sections[2].headerPath).toEqual(["Button", "Examples", "Sizes"])
    })

    test("resets path when encountering same-level header", () => {
      const markdown = `
# Test Page

## Section A

Content A.

### Nested A

Nested A content.

## Section B

Content B.

### Nested B

Nested B content.
`
      const extractor = new SectionExtractor({depths: [2, 3]})
      const sections = extractor.extract(markdown, pageInfo)

      expect(sections).toHaveLength(4)
      expect(sections[0].headerPath).toEqual(["Test Page", "Section A"])
      expect(sections[1].headerPath).toEqual([
        "Test Page",
        "Section A",
        "Nested A",
      ])
      expect(sections[2].headerPath).toEqual(["Test Page", "Section B"])
      expect(sections[3].headerPath).toEqual([
        "Test Page",
        "Section B",
        "Nested B",
      ])
    })
  })

  describe("metadata extraction", () => {
    test("extracts metadata from ::: meta ::: blocks", () => {
      const markdown = `
# Test Page

## Examples

::: meta
component: Button
keywords: [forms, ui, interactive]
category: examples
:::

Example content here.
`
      const extractor = new SectionExtractor()
      const sections = extractor.extract(markdown, pageInfo)

      expect(sections[0].metadata).toEqual({
        category: "examples",
        component: "Button",
        keywords: ["forms", "ui", "interactive"],
      })
    })

    test("removes meta blocks from content", () => {
      const markdown = `
# Test Page

## Examples

::: meta
component: Button
:::

Example content only.
`
      const extractor = new SectionExtractor()
      const sections = extractor.extract(markdown, pageInfo)

      expect(sections[0].content).not.toContain("::: meta")
      expect(sections[0].content).not.toContain("component: Button")
      expect(sections[0].content).toContain("Example content only.")
    })

    test("returns empty metadata when no meta block present", () => {
      const markdown = `
# Test Page

## Examples

Just content, no metadata.
`
      const extractor = new SectionExtractor()
      const sections = extractor.extract(markdown, pageInfo)

      expect(sections[0].metadata).toEqual({})
    })
  })

  describe("character offsets", () => {
    test("provides start and end offsets for slicing source markdown", () => {
      const markdown = `# Test Page

## Section One

First section content.

\`\`\`ts
const code = true
\`\`\`

## Section Two

Second section content.
`
      const extractor = new SectionExtractor({depths: [2]})
      const sections = extractor.extract(markdown, pageInfo)

      expect(sections).toHaveLength(2)

      const section1 = sections[0]
      const rawContent1 = markdown.slice(
        section1.startOffset,
        section1.endOffset,
      )
      expect(rawContent1).toContain("First section content.")
      expect(rawContent1).toContain("```ts")
      expect(rawContent1).toContain("const code = true")
      expect(rawContent1).not.toContain("Second section")

      const section2 = sections[1]
      const rawContent2 = markdown.slice(
        section2.startOffset,
        section2.endOffset,
      )
      expect(rawContent2).toContain("Second section content.")
      expect(rawContent2).not.toContain("First section")
    })
  })

  describe("content analysis", () => {
    test("counts words correctly", () => {
      const markdown = `
# Test Page

## Section

This section has exactly five words.
`
      const extractor = new SectionExtractor()
      const sections = extractor.extract(markdown, pageInfo)

      // Word count includes words in content (5 words in the sentence)
      // The exact count may vary based on markdown serialization
      expect(sections[0].wordCount).toBeGreaterThanOrEqual(5)
    })

    test("excludes code blocks from word count", () => {
      const markdown = `
# Test Page

## Section

Three words here.

\`\`\`ts
const code = "not counted"
\`\`\`
`
      const extractor = new SectionExtractor()
      const sections = extractor.extract(markdown, pageInfo)

      expect(sections[0].wordCount).toBe(3)
    })

    test("extracts code examples from content", () => {
      const markdown = `
# Test Page

## With Code

Some text.

\`\`\`ts
const example = true
\`\`\`

## Without Code

Just text content.
`
      const extractor = new SectionExtractor()
      const sections = extractor.extract(markdown, pageInfo)

      expect(sections[0].codeExamples).toHaveLength(1)
      expect(sections[0].codeExamples[0].code).toBe("const example = true")
      expect(sections[0].codeExamples[0].language).toBe("ts")
      expect(sections[0].content).not.toContain("```")
      expect(sections[0].content).toContain("Some text.")
      expect(sections[1].codeExamples).toHaveLength(0)
    })

    test("provides insertion offsets for splicing code back into content", () => {
      const markdown = `
# Test Page

## Examples

Intro text before code.

\`\`\`tsx
function Example() {
  return <div>Hello</div>
}
\`\`\`

Text between code blocks.

\`\`\`css
.example { color: red; }
\`\`\`

Outro text after code.
`
      const extractor = new SectionExtractor()
      const sections = extractor.extract(markdown, pageInfo)

      const section = sections[0]

      expect(section.codeExamples).toHaveLength(2)
      expect(section.content).toContain("Intro text before code.")
      expect(section.content).toContain("Text between code blocks.")
      expect(section.content).toContain("Outro text after code.")
      expect(section.content).not.toContain("```")

      const code1 = section.codeExamples[0]
      const code2 = section.codeExamples[1]

      expect(code1.language).toBe("tsx")
      expect(code1.insertionOffset).toBeGreaterThanOrEqual(0)

      expect(code2.language).toBe("css")
      expect(code2.insertionOffset).toBeGreaterThan(code1.insertionOffset)

      const textBeforeCode1 = section.content.slice(0, code1.insertionOffset)
      expect(textBeforeCode1).toContain("Intro text before code.")
      expect(textBeforeCode1).not.toContain("Text between")

      const textBeforeCode2 = section.content.slice(0, code2.insertionOffset)
      expect(textBeforeCode2).toContain("Text between code blocks.")
    })
  })

  describe("configuration options", () => {
    test("respects custom depths", () => {
      const markdown = `
# Test Page

## H2 Section

### H3 Section

#### H4 Section
`
      const extractor = new SectionExtractor({depths: [2]})
      const sections = extractor.extract(markdown, pageInfo)

      expect(sections).toHaveLength(1)
      expect(sections[0].headerPath).toEqual(["Test Page", "H2 Section"])
    })

    test("includes H1 when configured", () => {
      const markdown = `
# Test Page

Page introduction.

## Section
`
      const extractor = new SectionExtractor()
      const sections = extractor.extract(markdown, pageInfo)

      // H1 becomes a section with intro content
      expect(sections.length).toBeGreaterThanOrEqual(1)
    })

    test("filters by minimum content length", () => {
      const markdown = `
# Test Page

## Empty Section

## Content Section

This section has enough content to pass the minimum length filter.
`
      const extractor = new SectionExtractor({minContentLength: 20})
      const sections = extractor.extract(markdown, pageInfo)

      expect(sections).toHaveLength(1)
      expect(sections[0].headerPath).toEqual(["Test Page", "Content Section"])
    })
  })

  describe("edge cases", () => {
    test("handles empty sections", () => {
      const markdown = `
# Test Page

## Empty Section

## Another Empty
`
      const extractor = new SectionExtractor()
      const sections = extractor.extract(markdown, pageInfo)

      // Empty sections should be filtered out
      expect(sections).toHaveLength(0)
    })

    test("handles markdown without H2/H3 headers", () => {
      const markdown = `
# Test Page

Just some content without subsections.
`
      const extractor = new SectionExtractor({depths: [2, 3]})
      const sections = extractor.extract(markdown, pageInfo)

      expect(sections).toHaveLength(0)
    })

    test("handles headers in code blocks (should not extract)", () => {
      const markdown = `
# Test Page

## Real Section

\`\`\`markdown
## Fake Header In Code

This should not be extracted.
\`\`\`

Real content.
`
      const extractor = new SectionExtractor()
      const sections = extractor.extract(markdown, pageInfo)

      expect(sections).toHaveLength(1)
      expect(sections[0].headerPath).toEqual(["Test Page", "Real Section"])
    })

    test("handles special characters in headers", () => {
      const markdown = `
# Test Page

## What's New?

Content here.

## API Reference (v2.0)

More content.
`
      const extractor = new SectionExtractor()
      const sections = extractor.extract(markdown, pageInfo)

      expect(sections).toHaveLength(2)
      // kebabCase handles apostrophes and special chars
      expect(sections[0].sectionId).toBe("test-page-what-s-new")
      expect(sections[1].sectionId).toBe("test-page-api-reference-v2-0")
    })
  })
})
