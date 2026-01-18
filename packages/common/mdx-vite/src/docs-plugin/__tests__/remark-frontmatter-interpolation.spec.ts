// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import rehypeStringify from "rehype-stringify"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import {unified} from "unified"
import {describe, expect, test} from "vitest"

import type {PageFrontmatter} from "@qualcomm-ui/mdx-common"

import {remarkFrontmatterInterpolation} from "../remark/remark-frontmatter-interpolation"

async function process(
  mdx: string,
  frontmatter: PageFrontmatter,
): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkFrontmatterInterpolation, frontmatter)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(mdx)
  return String(result)
}

describe("remarkFrontmatterInterpolation", () => {
  test("replaces frontmatter.title with actual value", async () => {
    const input = `# {frontmatter.title}

Some content`

    const result = await process(input, {title: "Hello World"})
    expect(result).toContain("<h1>Hello World</h1>")
  })

  test("replaces frontmatter.description with actual value", async () => {
    const input = `# Title

{frontmatter.description}`

    const result = await process(input, {
      description: "This is a description",
      title: "Title",
    })
    expect(result).toContain("This is a description")
  })

  test("handles expressions with surrounding whitespace", async () => {
    const input = `# { frontmatter.title }

Some content`

    const result = await process(input, {title: "Spaced Title"})
    expect(result).toContain("<h1>Spaced Title</h1>")
  })

  test("handles numeric values", async () => {
    const input = `Page {frontmatter.order}`

    const result = await process(input, {order: 42, title: "Test"} as any)
    expect(result).toContain("Page 42")
  })

  test("leaves non-frontmatter expressions unchanged", async () => {
    const input = `# Title

{someOtherExpression}`

    const result = await process(input, {title: "Title"})
    // Non-frontmatter expressions are left in the AST as-is (not interpolated)
    // When rendered to HTML, they appear as text
    expect(result).toContain("someOtherExpression")
  })

  test("does not replace frontmatter keys in code blocks", async () => {
    const input = `# Title

\`\`\`markdown
# {frontmatter.title}
\`\`\`

Some content`

    const result = await process(input, {title: "Real Title"})
    expect(result).toContain("<h1>Title</h1>")
    expect(result).toContain("{frontmatter.title}")
  })

  test("handles multiple frontmatter expressions", async () => {
    const input = `# {frontmatter.title}

{frontmatter.description}

Order: {frontmatter.order}`

    const result = await process(input, {
      description: "A great page",
      order: 1,
      title: "My Page",
    } as any)
    expect(result).toContain("<h1>My Page</h1>")
    expect(result).toContain("A great page")
    expect(result).toContain("Order: 1")
  })

  test("preserves other content unchanged", async () => {
    const input = `# {frontmatter.title}

## Section

Some paragraph content.

- List item`

    const result = await process(input, {title: "Test"})
    expect(result).toContain("<h1>Test</h1>")
    expect(result).toContain("<h2>Section</h2>")
    expect(result).toContain("<p>Some paragraph content.</p>")
    expect(result).toContain("<li>List item</li>")
  })

  test("ignores missing frontmatter keys", async () => {
    const input = `# {frontmatter.title}

{frontmatter.missingKey}`

    const result = await process(input, {title: "Present"})
    expect(result).toContain("<h1>Present</h1>")
  })
})
