// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdir, mkdtemp, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {dirname, join} from "node:path"
import {afterEach, describe, expect, test} from "vitest"

import {
  type ConfigRoute,
  type DefineRouteFunction,
  type DefineRoutesFunction,
  hybridRoutes,
  type RouteManifest,
} from "./hybrid-routes.js"

let tempDir: string | undefined

afterEach(async () => {
  if (tempDir) {
    await rm(tempDir, {force: true, recursive: true})
    tempDir = undefined
  }
})

describe("hybridRoutes", () => {
  test("plus route groups discover plus folders and route files", async () => {
    const appDir = await createAppRoutes([
      "_index.mdx",
      "api/page-frontmatter.mdx",
      "api/page-frontmatter.route.mdx",
      "guide+/route.mdx",
      "guide+/markdown.ts",
      "guide+/advanced+/deep-topic.ts",
      "plain/ignored.ts",
    ])

    const routes = hybridRoutes("routes", createDefineRoutes(), {
      appDir,
    })

    expect(Object.keys(routes).sort()).toEqual([
      "routes/_index",
      "routes/api/page-frontmatter.route",
      "routes/guide+/advanced+/deep-topic",
      "routes/guide+/markdown",
      "routes/guide+/route",
    ])
    expect(routes["routes/guide+/route"]).toMatchObject({
      file: "routes/guide+/route.mdx",
      parentId: "root",
      path: "guide",
    })
    expect(routes["routes/guide+/markdown"]).toMatchObject({
      file: "routes/guide+/markdown.ts",
      parentId: "routes/guide+/route",
      path: "markdown",
    })
    expect(routes["routes/guide+/advanced+/deep-topic"]).toMatchObject({
      file: "routes/guide+/advanced+/deep-topic.ts",
      parentId: "routes/guide+/route",
      path: "advanced/deep-topic",
    })
    expect(routes["routes/api/page-frontmatter.route"]).toMatchObject({
      file: "routes/api/page-frontmatter.route.mdx",
      parentId: "root",
      path: "api/page-frontmatter",
    })
  })

  test("directory route groups discover plain nested route files", async () => {
    const appDir = await createAppRoutes([
      "_index.mdx",
      "api/page-frontmatter.mdx",
      "guide/route.mdx",
      "guide/markdown.ts",
      "guide/advanced/deep-topic.ts",
      "guide/_demos/ignored.mdx",
    ])

    const routes = hybridRoutes("routes", createDefineRoutes(), {
      appDir,
      routingStrategy: "react-router-directory-groups",
    })

    expect(Object.keys(routes).sort()).toEqual([
      "routes/_index",
      "routes/api/page-frontmatter",
      "routes/guide/advanced/deep-topic",
      "routes/guide/markdown",
      "routes/guide/route",
    ])
    expect(routes["routes/guide/route"]).toMatchObject({
      file: "routes/guide/route.mdx",
      parentId: "root",
      path: "guide",
    })
    expect(routes["routes/guide/markdown"]).toMatchObject({
      file: "routes/guide/markdown.ts",
      parentId: "routes/guide/route",
      path: "markdown",
    })
    expect(routes["routes/guide/advanced/deep-topic"]).toMatchObject({
      file: "routes/guide/advanced/deep-topic.ts",
      parentId: "routes/guide/route",
      path: "advanced/deep-topic",
    })
    expect(routes["routes/api/page-frontmatter"]).toMatchObject({
      file: "routes/api/page-frontmatter.mdx",
      parentId: "root",
      path: "api/page-frontmatter",
    })
  })
})

async function createAppRoutes(routeFiles: string[]): Promise<string> {
  tempDir = await mkdtemp(join(tmpdir(), "hybrid-routes-test-"))
  const routesDir = join(tempDir, "routes")

  for (const routeFile of routeFiles) {
    const filePath = join(routesDir, routeFile)
    await mkdir(dirname(filePath), {recursive: true})
    await writeFile(filePath, "", "utf-8")
  }

  return tempDir
}

function createDefineRoutes(): DefineRoutesFunction {
  return (callback) => {
    const routes: RouteManifest = {}
    const parentIds: string[] = []

    const defineRoute: DefineRouteFunction = (
      path,
      file,
      optionsOrChildren,
      children,
    ) => {
      const id = file.replace(/\.[^/.]+$/, "")
      const route: ConfigRoute = {file, id}
      const parentId = parentIds.at(-1)
      const options =
        typeof optionsOrChildren === "function" ? undefined : optionsOrChildren
      const childRoutes =
        typeof optionsOrChildren === "function" ? optionsOrChildren : children

      if (path !== undefined) {
        route.path = path
      }
      if (options?.index) {
        route.index = true
      }
      if (parentId) {
        route.parentId = parentId
      }

      routes[id] = route

      if (childRoutes) {
        parentIds.push(id)
        childRoutes()
        parentIds.pop()
      }
    }

    callback(defineRoute)

    return routes
  }
}
