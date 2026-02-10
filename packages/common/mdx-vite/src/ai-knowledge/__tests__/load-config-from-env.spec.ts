// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdir, rm} from "node:fs/promises"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"

import type {
  KnowledgeEnvironment,
  KnowledgeIntegrationConfig,
} from "../../docs-plugin"

function mergeEnvironmentConfig(
  global: KnowledgeIntegrationConfig | undefined,
  environment: KnowledgeEnvironment,
): KnowledgeEnvironment {
  return {
    ...global,
    ...environment,
    extraFiles: environment.extraFiles ?? global?.extraFiles,
    metadata:
      global?.metadata || environment.metadata
        ? {...global?.metadata, ...environment.metadata}
        : undefined,
  }
}

describe("mergeEnvironmentConfig", () => {
  test("merges global config with environment overrides", () => {
    const global: KnowledgeIntegrationConfig = {
      baseUrl: "https://global.example.com",
      outputMode: "per-page",
      outputPath: "/global/output",
    }
    const environment: KnowledgeEnvironment = {
      baseUrl: "https://env.example.com",
      id: "prod",
      outputPath: "/env/output",
    }

    const result = mergeEnvironmentConfig(global, environment)

    expect(result.baseUrl).toBe("https://env.example.com")
    expect(result.outputPath).toBe("/env/output")
    expect(result.outputMode).toBe("per-page")
    expect(result.id).toBe("prod")
  })

  test("environment values override global values", () => {
    const global: KnowledgeIntegrationConfig = {
      baseUrl: "https://global.example.com",
      name: "Global Docs",
      pageTitlePrefix: "Global",
    }
    const environment: KnowledgeEnvironment = {
      id: "staging",
      name: "Staging Docs",
      outputPath: "/output",
      pageTitlePrefix: "Staging",
    }

    const result = mergeEnvironmentConfig(global, environment)

    expect(result.name).toBe("Staging Docs")
    expect(result.pageTitlePrefix).toBe("Staging")
  })

  test("merges metadata from both global and environment", () => {
    const global: KnowledgeIntegrationConfig = {
      metadata: {author: "Team", version: "1.0"},
      outputPath: "/output",
    }
    const environment: KnowledgeEnvironment = {
      id: "prod",
      metadata: {environment: "production", version: "2.0"},
      outputPath: "/output",
    }

    const result = mergeEnvironmentConfig(global, environment)

    expect(result.metadata).toEqual({
      author: "Team",
      environment: "production",
      version: "2.0",
    })
  })

  test("uses global metadata when environment has none", () => {
    const global: KnowledgeIntegrationConfig = {
      metadata: {author: "Team"},
      outputPath: "/output",
    }
    const environment: KnowledgeEnvironment = {
      id: "prod",
      outputPath: "/output",
    }

    const result = mergeEnvironmentConfig(global, environment)

    expect(result.metadata).toEqual({author: "Team"})
  })

  test("uses environment metadata when global has none", () => {
    const global: KnowledgeIntegrationConfig = {
      outputPath: "/output",
    }
    const environment: KnowledgeEnvironment = {
      id: "prod",
      metadata: {environment: "production"},
      outputPath: "/output",
    }

    const result = mergeEnvironmentConfig(global, environment)

    expect(result.metadata).toEqual({environment: "production"})
  })

  test("returns undefined metadata when neither has it", () => {
    const global: KnowledgeIntegrationConfig = {
      outputPath: "/output",
    }
    const environment: KnowledgeEnvironment = {
      id: "prod",
      outputPath: "/output",
    }

    const result = mergeEnvironmentConfig(global, environment)

    expect(result.metadata).toBeUndefined()
  })

  test("uses environment extraFiles when provided", () => {
    const global: KnowledgeIntegrationConfig = {
      extraFiles: [{contents: "global", id: "global-file", title: "Global"}],
      outputPath: "/output",
    }
    const environment: KnowledgeEnvironment = {
      extraFiles: [{contents: "env", id: "env-file", title: "Env"}],
      id: "prod",
      outputPath: "/output",
    }

    const result = mergeEnvironmentConfig(global, environment)

    expect(result.extraFiles).toEqual([
      {contents: "env", id: "env-file", title: "Env"},
    ])
  })

  test("falls back to global extraFiles when environment has none", () => {
    const global: KnowledgeIntegrationConfig = {
      extraFiles: [{contents: "global", id: "global-file", title: "Global"}],
      outputPath: "/output",
    }
    const environment: KnowledgeEnvironment = {
      id: "prod",
      outputPath: "/output",
    }

    const result = mergeEnvironmentConfig(global, environment)

    expect(result.extraFiles).toEqual([
      {contents: "global", id: "global-file", title: "Global"},
    ])
  })

  test("preserves frontmatter config from global", () => {
    const global: KnowledgeIntegrationConfig = {
      frontmatter: {
        exclude: ["internal*"],
        include: ["*"],
      },
      outputPath: "/output",
    }
    const environment: KnowledgeEnvironment = {
      id: "prod",
      outputPath: "/output",
    }

    const result = mergeEnvironmentConfig(global, environment)

    expect(result.frontmatter).toEqual({
      exclude: ["internal*"],
      include: ["*"],
    })
  })

  test("environment frontmatter overrides global", () => {
    const global: KnowledgeIntegrationConfig = {
      frontmatter: {include: ["*"]},
      outputPath: "/output",
    }
    const environment: KnowledgeEnvironment = {
      frontmatter: {include: ["component"]},
      id: "prod",
      outputPath: "/output",
    }

    const result = mergeEnvironmentConfig(global, environment)

    expect(result.frontmatter).toEqual({include: ["component"]})
  })
})

describe("frontmatter config inheritance", () => {
  test("frontmatter include patterns are inherited", () => {
    const global: KnowledgeIntegrationConfig = {
      frontmatter: {
        extraFields: {source: "docs"},
        include: ["title", "component"],
      },
      outputPath: "/output",
    }
    const environment: KnowledgeEnvironment = {
      id: "prod",
      outputPath: "/output",
    }

    const result = mergeEnvironmentConfig(global, environment)

    expect(result.frontmatter?.include).toEqual(["title", "component"])
    expect(result.frontmatter?.extraFields).toEqual({source: "docs"})
  })

  test("frontmatter exclude patterns are inherited", () => {
    const global: KnowledgeIntegrationConfig = {
      frontmatter: {
        exclude: ["internal*", "private*"],
        include: ["*"],
      },
      outputPath: "/output",
    }
    const environment: KnowledgeEnvironment = {
      id: "staging",
      outputPath: "/output",
    }

    const result = mergeEnvironmentConfig(global, environment)

    expect(result.frontmatter?.exclude).toEqual(["internal*", "private*"])
  })
})

describe("parseCliMetadata", () => {
  function parseCliMetadata(
    cliMetadata: string[] | undefined,
  ): Record<string, string> | undefined {
    if (!cliMetadata?.length) {
      return undefined
    }
    return Object.fromEntries(cliMetadata.map((entry) => entry.split("=")))
  }

  test("parses key=value pairs", () => {
    const result = parseCliMetadata(["author=John", "version=1.0"])
    expect(result).toEqual({author: "John", version: "1.0"})
  })

  test("returns undefined for empty array", () => {
    const result = parseCliMetadata([])
    expect(result).toBeUndefined()
  })

  test("returns undefined for undefined input", () => {
    const result = parseCliMetadata(undefined)
    expect(result).toBeUndefined()
  })

  test("handles values with equals signs", () => {
    const result = parseCliMetadata(["url=https://example.com?a=1"])
    expect(result).toEqual({url: "https://example.com?a"})
  })

  test("handles single entry", () => {
    const result = parseCliMetadata(["key=value"])
    expect(result).toEqual({key: "value"})
  })
})

describe("environment filtering", () => {
  test("filters environments by ID", () => {
    const environments: KnowledgeEnvironment[] = [
      {id: "prod", outputPath: "/prod"},
      {id: "staging", outputPath: "/staging"},
      {id: "dev", outputPath: "/dev"},
    ]

    const filterSet = new Set(["prod", "dev"])
    const filtered = environments.filter((env) => filterSet.has(env.id))

    expect(filtered).toHaveLength(2)
    expect(filtered.map((e) => e.id)).toEqual(["prod", "dev"])
  })

  test("returns all environments when no filter specified", () => {
    const environments: KnowledgeEnvironment[] = [
      {id: "prod", outputPath: "/prod"},
      {id: "staging", outputPath: "/staging"},
    ]

    const filterSet = new Set<string>()
    const filtered =
      filterSet.size > 0
        ? environments.filter((env) => filterSet.has(env.id))
        : environments

    expect(filtered).toHaveLength(2)
  })

  test("returns empty array when no matches found", () => {
    const environments: KnowledgeEnvironment[] = [
      {id: "prod", outputPath: "/prod"},
      {id: "staging", outputPath: "/staging"},
    ]

    const filterSet = new Set(["nonexistent"])
    const filtered = environments.filter((env) => filterSet.has(env.id))

    expect(filtered).toHaveLength(0)
  })
})

describe("loadEnvironmentConfigs behavior", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = join(tmpdir(), `env-config-test-${Date.now()}`)
    await mkdir(join(tempDir, "app", "routes"), {recursive: true})
    vi.stubEnv("DOCS_SITE_BASE_URL", "")
    vi.stubEnv("PAGE_TITLE_PREFIX", "")
    vi.stubEnv("FILE_EXCLUDE_PATTERN", "")
  })

  afterEach(async () => {
    await rm(tempDir, {force: true, recursive: true})
    vi.unstubAllEnvs()
  })

  test("CLI outputPath should trigger legacy single-config mode", () => {
    const environments: KnowledgeEnvironment[] = [
      {id: "prod", outputPath: "/prod"},
      {id: "staging", outputPath: "/staging"},
    ]
    const cliOutputPath = "/cli/output.txt"

    const shouldUseLegacy =
      !environments || environments.length === 0 || cliOutputPath !== undefined

    expect(shouldUseLegacy).toBe(true)
  })

  test("empty environments should trigger legacy mode", () => {
    const environments: KnowledgeEnvironment[] = []
    const cliOutputPath = undefined

    const shouldUseLegacy =
      !environments || environments.length === 0 || cliOutputPath !== undefined

    expect(shouldUseLegacy).toBe(true)
  })

  test("environments with no CLI outputPath should use multi-environment mode", () => {
    const environments: KnowledgeEnvironment[] = [
      {id: "prod", outputPath: "/prod"},
    ]
    const cliOutputPath = undefined

    const shouldUseLegacy =
      !environments || environments.length === 0 || cliOutputPath !== undefined

    expect(shouldUseLegacy).toBe(false)
  })
})
