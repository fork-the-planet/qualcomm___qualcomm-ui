import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import {unified} from "unified"
import {describe, expect, test} from "vitest"

import {remarkFrontmatterDescription} from "../remark"

async function process(mdx: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkFrontmatterDescription)
    .use(remarkStringify)
    .process(mdx)
  return String(result)
}

describe("remarkFrontmatterDescription", () => {
  test("wraps frontmatter.description in a paragraph with mdx class", async () => {
    const input = `# Title

{frontmatter.description}

Some content`

    const result = await process(input)
    expect(result).toContain('<p className="mdx qui-docs__page-description">')
    expect(result).toContain("{frontmatter.description}")
    expect(result).toContain("</p>")
  })

  test("handles frontmatter.description with surrounding whitespace", async () => {
    const input = `# Title

{ frontmatter.description }

Some content`

    const result = await process(input)
    // Whitespace inside expressions is normalized, so this should still wrap
    expect(result).toContain('<p className="mdx qui-docs__page-description">')
  })

  test("does not wrap other expressions", async () => {
    const input = `# Title

{frontmatter.title}

{someOtherExpression}

Some content`

    const result = await process(input)
    expect(result).not.toContain(
      '<p className="mdx qui-docs__page-description">',
    )
  })

  test("preserves other content", async () => {
    const input = `# Title

{frontmatter.description}

## Section

Some paragraph content.`

    const result = await process(input)
    expect(result).toContain("# Title")
    expect(result).toContain("## Section")
    expect(result).toContain("Some paragraph content.")
  })

  test("handles multiple frontmatter.description expressions", async () => {
    const input = `# Title

{frontmatter.description}

## Section

{frontmatter.description}`

    const result = await process(input)
    const matches = result.match(
      /<p className="mdx qui-docs__page-description">/g,
    )
    expect(matches).toHaveLength(2)
  })
})
