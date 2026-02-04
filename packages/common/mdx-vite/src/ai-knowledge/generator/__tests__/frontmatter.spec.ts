// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {minimatch} from "minimatch"
import {describe, expect, test} from "vitest"

interface FrontmatterConfig {
  exclude?: string[]
  extraFields?: Record<string, string | string[]>
  include?: string[]
}

function filterFrontmatter(
  frontmatter: Record<string, unknown>,
  config: FrontmatterConfig,
): [string, string | string[]][] {
  const entries: [string, string | string[]][] = []

  if (config.include?.length) {
    const includePatterns = config.include
    const excludePatterns = config.exclude ?? []

    for (const [field, value] of Object.entries(frontmatter)) {
      if (value === undefined) {
        continue
      }
      const isIncluded = includePatterns.some((pattern) =>
        minimatch(field, pattern),
      )
      const isExcluded = excludePatterns.some((pattern) =>
        minimatch(field, pattern),
      )
      if (isIncluded && !isExcluded) {
        entries.push([field, String(value as string)])
      }
    }
  }

  if (config.extraFields) {
    for (const [key, value] of Object.entries(config.extraFields)) {
      entries.push([key, value])
    }
  }

  return entries
}

function formatFrontmatter(entries: [string, string | string[]][]): string {
  if (entries.length === 0) {
    return ""
  }

  const lines = ["---"]
  for (const [key, value] of entries) {
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.join(", ")}]`)
    } else {
      lines.push(`${key}: ${value}`)
    }
  }
  lines.push("---")
  return lines.join("\n")
}

describe("frontmatter filtering", () => {
  describe("include patterns", () => {
    test('include: ["*"] includes all fields', () => {
      const frontmatter = {
        component: "Button",
        description: "A button component",
        title: "Button",
      }
      const config: FrontmatterConfig = {include: ["*"]}
      const result = filterFrontmatter(frontmatter, config)
      expect(result).toEqual([
        ["component", "Button"],
        ["description", "A button component"],
        ["title", "Button"],
      ])
    })

    test('include: ["component"] includes only specific field', () => {
      const frontmatter = {
        component: "Button",
        description: "A button",
        title: "Button",
      }
      const config: FrontmatterConfig = {include: ["component"]}
      const result = filterFrontmatter(frontmatter, config)
      expect(result).toEqual([["component", "Button"]])
    })

    test('include: ["meta*"] matches glob pattern', () => {
      const frontmatter = {
        component: "Button",
        metaDescription: "SEO description",
        metaTitle: "Button - QUI",
        title: "Button",
      }
      const config: FrontmatterConfig = {include: ["meta*"]}
      const result = filterFrontmatter(frontmatter, config)
      expect(result).toEqual([
        ["metaDescription", "SEO description"],
        ["metaTitle", "Button - QUI"],
      ])
    })

    test("multiple include patterns", () => {
      const frontmatter = {
        author: "Team",
        component: "Button",
        description: "A button",
        title: "Button",
      }
      const config: FrontmatterConfig = {include: ["component", "author"]}
      const result = filterFrontmatter(frontmatter, config)
      expect(result).toEqual([
        ["author", "Team"],
        ["component", "Button"],
      ])
    })
  })

  describe("exclude patterns", () => {
    test('exclude: ["title", "description"] excludes specific fields', () => {
      const frontmatter = {
        component: "Button",
        description: "A button",
        title: "Button",
      }
      const config: FrontmatterConfig = {
        exclude: ["title", "description"],
        include: ["*"],
      }
      const result = filterFrontmatter(frontmatter, config)
      expect(result).toEqual([["component", "Button"]])
    })

    test("exclude pattern with glob", () => {
      const frontmatter = {
        component: "Button",
        internalId: "btn-001",
        internalNotes: "Do not publish",
        title: "Button",
      }
      const config: FrontmatterConfig = {
        exclude: ["internal*"],
        include: ["*"],
      }
      const result = filterFrontmatter(frontmatter, config)
      expect(result).toEqual([
        ["component", "Button"],
        ["title", "Button"],
      ])
    })
  })

  describe("combined include/exclude", () => {
    test('include: ["*"], exclude: ["internal*"] filters correctly', () => {
      const frontmatter = {
        component: "Button",
        description: "A button component",
        internalNotes: "Do not publish",
        title: "Button",
      }
      const config: FrontmatterConfig = {
        exclude: ["internal*", "title", "description"],
        include: ["*"],
      }
      const result = filterFrontmatter(frontmatter, config)
      expect(result).toEqual([["component", "Button"]])
    })

    test("exclude takes precedence over include", () => {
      const frontmatter = {
        metaDescription: "SEO",
        metaInternal: "Hidden",
        metaTitle: "Title",
      }
      const config: FrontmatterConfig = {
        exclude: ["*Internal"],
        include: ["meta*"],
      }
      const result = filterFrontmatter(frontmatter, config)
      expect(result).toEqual([
        ["metaDescription", "SEO"],
        ["metaTitle", "Title"],
      ])
    })
  })

  describe("extraFields", () => {
    test("adds static string field", () => {
      const config: FrontmatterConfig = {
        extraFields: {source: "docs"},
      }
      const result = filterFrontmatter({}, config)
      expect(result).toEqual([["source", "docs"]])
    })

    test("adds array field", () => {
      const config: FrontmatterConfig = {
        extraFields: {tags: ["react", "components"]},
      }
      const result = filterFrontmatter({}, config)
      expect(result).toEqual([["tags", ["react", "components"]]])
    })

    test("combines filtered fields with extra fields", () => {
      const frontmatter = {component: "Button"}
      const config: FrontmatterConfig = {
        extraFields: {framework: "react", tags: ["ui", "button"]},
        include: ["component"],
      }
      const result = filterFrontmatter(frontmatter, config)
      expect(result).toEqual([
        ["component", "Button"],
        ["framework", "react"],
        ["tags", ["ui", "button"]],
      ])
    })
  })

  describe("edge cases", () => {
    test("handles undefined values in frontmatter", () => {
      const frontmatter = {
        component: "Button",
        description: undefined,
        title: "Button",
      }
      const config: FrontmatterConfig = {include: ["*"]}
      const result = filterFrontmatter(frontmatter, config)
      expect(result).toEqual([
        ["component", "Button"],
        ["title", "Button"],
      ])
    })

    test("returns empty array when no include patterns", () => {
      const frontmatter = {component: "Button"}
      const config: FrontmatterConfig = {}
      const result = filterFrontmatter(frontmatter, config)
      expect(result).toEqual([])
    })

    test("handles empty frontmatter", () => {
      const config: FrontmatterConfig = {include: ["*"]}
      const result = filterFrontmatter({}, config)
      expect(result).toEqual([])
    })
  })
})

describe("frontmatter formatting", () => {
  test("formats entries with YAML frontmatter syntax", () => {
    const entries: [string, string | string[]][] = [
      ["url", "https://example.com"],
      ["component", "Button"],
    ]
    const result = formatFrontmatter(entries)
    expect(result).toBe(`---
url: https://example.com
component: Button
---`)
  })

  test("formats array values correctly", () => {
    const entries: [string, string | string[]][] = [["tags", ["a", "b", "c"]]]
    const result = formatFrontmatter(entries)
    expect(result).toBe(`---
tags: [a, b, c]
---`)
  })

  test("returns empty string for no entries", () => {
    const result = formatFrontmatter([])
    expect(result).toBe("")
  })

  test("handles mixed string and array values", () => {
    const entries: [string, string | string[]][] = [
      ["title", "Button"],
      ["tags", ["ui", "react"]],
      ["author", "Team"],
    ]
    const result = formatFrontmatter(entries)
    expect(result).toBe(`---
title: Button
tags: [ui, react]
author: Team
---`)
  })
})
