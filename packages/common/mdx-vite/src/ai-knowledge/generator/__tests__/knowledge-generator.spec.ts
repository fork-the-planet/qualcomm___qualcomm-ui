// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import AdmZip from "adm-zip"
import {mkdir, readdir, readFile, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {dirname, join} from "node:path"
import {fileURLToPath} from "node:url"
import {afterEach, beforeEach, describe, expect, test} from "vitest"

import type {AiKnowledgeConfig} from "../../types"
import {KnowledgeGenerator} from "../knowledge-generator"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const fixturesDir = join(__dirname, "__fixtures__")

describe("KnowledgeGenerator", () => {
  let tempDir: string
  let outputDir: string

  beforeEach(async () => {
    tempDir = join(tmpdir(), `knowledge-test-${Date.now()}`)
    outputDir = join(tempDir, "output")
    await mkdir(outputDir, {recursive: true})
  })

  afterEach(async () => {
    await rm(tempDir, {force: true, recursive: true})
  })

  function createConfig(
    overrides: Partial<AiKnowledgeConfig> = {},
  ): AiKnowledgeConfig {
    return {
      outputMode: "per-page",
      outputPath: outputDir,
      routeDir: fixturesDir,
      ...overrides,
    }
  }

  describe("scanPages", () => {
    test("discovers MDX files in route directory", async () => {
      const config = createConfig()
      const generator = new KnowledgeGenerator(config)
      const pages = await generator.run()

      expect(pages.length).toBeGreaterThan(0)
      const pageIds = pages.map((p) => p.id)
      expect(pageIds.some((id) => id.includes("sample-page"))).toBe(true)
      expect(pageIds.some((id) => id.includes("page-with-demos"))).toBe(true)
    })

    test("respects exclude patterns", async () => {
      const config = createConfig({
        exclude: ["page-with-demos/**"],
      })
      const generator = new KnowledgeGenerator(config)
      const pages = await generator.run()

      const pageIds = pages.map((p) => p.id)
      expect(pageIds.some((id) => id.includes("page-with-demos"))).toBe(false)
      expect(pageIds.some((id) => id.includes("sample-page"))).toBe(true)
    })

    test("generates correct page IDs with prefix", async () => {
      const config = createConfig({
        pageIdPrefix: "test",
      })
      const generator = new KnowledgeGenerator(config)
      const pages = await generator.run()

      expect(pages.every((p) => p.id.startsWith("test-"))).toBe(true)
    })

    test("resolves base URLs", async () => {
      const config = createConfig({
        baseUrl: "https://docs.example.com",
      })
      const generator = new KnowledgeGenerator(config)
      const pages = await generator.run()

      const pageWithUrl = pages.find((p) => p.url !== undefined)
      expect(pageWithUrl?.url).toContain("https://docs.example.com")
    })
  })

  describe("processMdxPage", () => {
    test("extracts frontmatter from MDX", async () => {
      const config = createConfig({
        frontmatter: {
          include: ["title", "component"],
        },
      })
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const outputFiles = await readdir(outputDir)
      const mdFile = outputFiles.find((f) => f.includes("sample-page"))
      expect(mdFile).toBeDefined()

      const content = await readFile(join(outputDir, mdFile!), "utf-8")
      expect(content).toContain("component: Button")
    })

    test("processes content and removes JSX", async () => {
      const config = createConfig()
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const outputFiles = await readdir(outputDir)
      const mdFile = outputFiles.find((f) => f.includes("sample-page"))
      const content = await readFile(join(outputDir, mdFile!), "utf-8")

      expect(content).toContain("# Button")
      expect(content).toContain("npm install")
      expect(content).not.toContain("<NpmInstallTabs")
    })
  })

  describe("generatePerPageExports", () => {
    test("creates individual MD files", async () => {
      const config = createConfig()
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const outputFiles = await readdir(outputDir)
      const mdFiles = outputFiles.filter((f) => f.endsWith(".md"))
      expect(mdFiles.length).toBeGreaterThan(0)
    })

    test("includes URL in frontmatter when baseUrl is set", async () => {
      const config = createConfig({
        baseUrl: "https://docs.example.com",
      })
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const outputFiles = await readdir(outputDir)
      const mdFile = outputFiles.find((f) => f.includes("sample-page"))
      const content = await readFile(join(outputDir, mdFile!), "utf-8")

      expect(content).toContain("url: https://docs.example.com")
    })

    test("includes metadata in frontmatter", async () => {
      const config = createConfig({
        metadata: {
          author: "Test Team",
          version: "1.0",
        },
      })
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const outputFiles = await readdir(outputDir)
      const mdFile = outputFiles.find((f) => f.includes("sample-page"))
      const content = await readFile(join(outputDir, mdFile!), "utf-8")

      expect(content).toContain("author: Test Team")
      expect(content).toContain("version: 1.0")
    })

    test("applies page title prefix to page name", async () => {
      const config = createConfig({
        pageTitlePrefix: "QUI",
      })
      const generator = new KnowledgeGenerator(config)
      const pages = await generator.run()

      const buttonPage = pages.find((p) => p.id.includes("sample-page"))
      expect(buttonPage?.name).toBe("QUI Button")
    })
  })

  describe("generateAggregatedOutput", () => {
    test("creates single combined file", async () => {
      const llmsTxtPath = join(tempDir, "llms.txt")
      const config = createConfig({
        outputMode: "aggregated",
        outputPath: llmsTxtPath,
      })
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const content = await readFile(llmsTxtPath, "utf-8")
      expect(content).toContain("## Button")
      expect(content).toContain("## Card")
    })

    test("includes project name and description", async () => {
      const llmsTxtPath = join(tempDir, "llms.txt")
      const config = createConfig({
        description: "A component library",
        name: "QUI Components",
        outputMode: "aggregated",
        outputPath: llmsTxtPath,
      })
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const content = await readFile(llmsTxtPath, "utf-8")
      expect(content).toContain("# QUI Components")
      expect(content).toContain("> A component library")
    })

    test("increments heading levels in aggregated mode", async () => {
      const llmsTxtPath = join(tempDir, "llms.txt")
      const config = createConfig({
        outputMode: "aggregated",
        outputPath: llmsTxtPath,
      })
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const content = await readFile(llmsTxtPath, "utf-8")
      expect(content).toContain("### Installation")
    })
  })

  describe("generateManifest", () => {
    test("creates manifest.json with file metadata", async () => {
      const manifestDir = join(tempDir, "exports")
      const config = createConfig({
        generateBulkZip: false,
        manifestOutputPath: manifestDir,
      })
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const manifestContent = await readFile(
        join(manifestDir, "manifest.json"),
        "utf-8",
      )
      const manifest = JSON.parse(manifestContent)

      expect(manifest.version).toBe(1)
      expect(manifest.totalFiles).toBeGreaterThan(0)
      expect(manifest.files).toBeInstanceOf(Array)
      expect(manifest.aggregateHash).toMatch(/^[a-f0-9]{32}$/)
      expect(manifest.generatedAt).toBeDefined()
    })

    test("manifest entries include MD5 hashes", async () => {
      const manifestDir = join(tempDir, "exports")
      const config = createConfig({
        generateBulkZip: false,
        manifestOutputPath: manifestDir,
      })
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const manifestContent = await readFile(
        join(manifestDir, "manifest.json"),
        "utf-8",
      )
      const manifest = JSON.parse(manifestContent)

      for (const entry of manifest.files) {
        expect(entry.md5).toMatch(/^[a-f0-9]{32}$/)
        expect(entry.path).toMatch(/\.md$/)
        expect(entry.size).toBeGreaterThan(0)
      }
    })
  })

  describe("generateBulkZip", () => {
    test("creates zip archive with all markdown files", async () => {
      const manifestDir = join(tempDir, "exports")
      const config = createConfig({
        manifestOutputPath: manifestDir,
      })
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const zipPath = join(manifestDir, "bulk.zip")
      const zip = new AdmZip(zipPath)
      const zipEntries = zip.getEntries()

      expect(zipEntries.length).toBeGreaterThan(0)
      for (const entry of zipEntries) {
        expect(entry.entryName).toMatch(/\.md$/)
      }
    })

    test("zip file can be extracted and read", async () => {
      const manifestDir = join(tempDir, "exports")
      const config = createConfig({
        manifestOutputPath: manifestDir,
      })
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const zipPath = join(manifestDir, "bulk.zip")
      const zip = new AdmZip(zipPath)
      const sampleEntry = zip
        .getEntries()
        .find((e) => e.entryName.includes("sample-page"))

      expect(sampleEntry).toBeDefined()
      const content = sampleEntry!.getData().toString("utf-8")
      expect(content).toContain("# Button")
    })
  })

  describe("URL transformation", () => {
    test("transforms relative URLs to absolute in per-page mode", async () => {
      await mkdir(join(tempDir, "routes"), {recursive: true})
      await writeFile(
        join(tempDir, "routes", "_test.mdx"),
        `---
title: Test
---

See [Button](/components/button) for more info.
Check [anchor](./#section) link.
`,
      )

      const config = createConfig({
        baseUrl: "https://docs.example.com",
        routeDir: join(tempDir, "routes"),
      })
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const outputFiles = await readdir(outputDir)
      const mdFile = outputFiles.find((f) => f.includes("test"))
      const content = await readFile(join(outputDir, mdFile!), "utf-8")

      expect(content).toContain("https://docs.example.com/components/button")
    })
  })

  describe("demo processing", () => {
    test("replaces Demo elements with source code", async () => {
      const config = createConfig()
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const outputFiles = await readdir(outputDir)
      const mdFile = outputFiles.find((f) => f.includes("page-with-demos"))
      const content = await readFile(join(outputDir, mdFile!), "utf-8")

      expect(content).toContain("```tsx")
      expect(content).toContain('import {Card} from "./card"')
      expect(content).not.toContain("<Demo")
    })

    test("removes preview lines from demo code", async () => {
      const config = createConfig()
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const outputFiles = await readdir(outputDir)
      const mdFile = outputFiles.find((f) => f.includes("page-with-demos"))
      const content = await readFile(join(outputDir, mdFile!), "utf-8")

      expect(content).not.toContain("// preview")
    })

    test("includes relative imports as code blocks after demos", async () => {
      const config = createConfig()
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const outputFiles = await readdir(outputDir)
      const mdFile = outputFiles.find((f) => f.includes("page-with-demos"))
      const content = await readFile(join(outputDir, mdFile!), "utf-8")

      expect(content).toContain('title="card.tsx"')
      expect(content).not.toContain("## Related Source Files")
    })
  })

  describe("clean option", () => {
    test("removes output directory when clean is true", async () => {
      await writeFile(join(outputDir, "old-file.md"), "old content")

      const config = createConfig({
        clean: true,
      })
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const files = await readdir(outputDir)
      expect(files).not.toContain("old-file.md")
    })
  })

  describe("extraFiles", () => {
    test("generates extra files from config", async () => {
      const manifestDir = join(tempDir, "exports")
      const config = createConfig({
        extraFiles: [
          {
            contents: "# Getting Started\n\nIntroduction content.",
            id: "getting-started",
            title: "Getting Started",
          },
        ],
        manifestOutputPath: manifestDir,
      })
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const files = await readdir(outputDir)
      expect(files).toContain("getting-started.md")

      const content = await readFile(
        join(outputDir, "getting-started.md"),
        "utf-8",
      )
      expect(content).toContain("# Getting Started")
      expect(content).toContain("Introduction content.")
    })

    test("extra files appear in manifest", async () => {
      const manifestDir = join(tempDir, "exports")
      const config = createConfig({
        extraFiles: [
          {
            contents: "Extra content",
            id: "extra",
            title: "Extra",
          },
        ],
        generateBulkZip: false,
        manifestOutputPath: manifestDir,
      })
      const generator = new KnowledgeGenerator(config)
      await generator.run()

      const manifestContent = await readFile(
        join(manifestDir, "manifest.json"),
        "utf-8",
      )
      const manifest = JSON.parse(manifestContent)

      const extraEntry = manifest.files.find(
        (f: {id: string}) => f.id === "extra",
      )
      expect(extraEntry).toBeDefined()
      expect(extraEntry.path).toBe("extra.md")
    })
  })
})
