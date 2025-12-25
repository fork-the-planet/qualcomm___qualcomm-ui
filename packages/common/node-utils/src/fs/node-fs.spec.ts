import {dirname} from "node:path"
import {fileURLToPath} from "node:url"
import {describe, expect, test} from "vitest"

import {exists} from "./node-fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe("exists", () => {
  test("returns true for an existing file", async () => {
    expect(await exists(__filename)).toBe(true)
  })

  test("returns true for an existing directory", async () => {
    expect(await exists(__dirname)).toBe(true)
  })

  test("returns false for a non-existent path", async () => {
    expect(await exists("./this/path/does/not/exist")).toBe(false)
  })
})
