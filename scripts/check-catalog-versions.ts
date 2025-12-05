import {readFile, writeFile} from "node:fs/promises"
import {parseDocument} from "yaml"

interface CatalogEntry {
  current: string
  latest: string | null
  name: string
  prefix: string
  updateAvailable: boolean
}

async function fetchLatestVersion(pkg: string): Promise<string | null> {
  const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`)
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  return data.version
}

function parseVersionConstraint(constraint: string): {
  prefix: string
  version: string
} {
  const match = constraint.match(/^([~^]?)(.+)$/)
  return {prefix: match?.[1] ?? "", version: match?.[2] ?? constraint}
}

async function checkCatalog(filePath: string, update = false): Promise<void> {
  const content = await readFile(filePath, "utf-8")
  const doc = parseDocument(content)
  const catalog = doc.get("catalog") as Record<string, string> | undefined

  if (!catalog) {
    console.error("No catalog found in", filePath)
    process.exit(1)
  }

  const entries = Object.entries(catalog)
  const results: CatalogEntry[] = await Promise.all(
    entries.map(async ([name, current]) => {
      const {prefix, version} = parseVersionConstraint(current)
      const latest = await fetchLatestVersion(name)
      return {
        current,
        latest,
        name,
        prefix,
        updateAvailable: latest !== null && latest !== version,
      }
    }),
  )

  const updates = results.filter((r) => r.updateAvailable)

  if (updates.length === 0) {
    console.log("All packages are up to date.")
    return
  }

  const nameWidth = Math.max(...updates.map((u) => u.name.length))
  const currentWidth = Math.max(...updates.map((u) => u.current.length))

  for (const {current, latest, name, prefix} of updates) {
    const newVersion = `${prefix}${latest}`
    console.log(
      `${name.padEnd(nameWidth)}  ${current.padEnd(currentWidth)}  →  ${newVersion}`,
    )
  }

  if (update) {
    const catalogNode = doc.get("catalog", true)
    for (const {latest, name, prefix} of updates) {
      catalogNode.set(name, `${prefix}${latest}`)
    }
    await writeFile(filePath, doc.toString(), "utf-8")
    console.log(`\nUpdated ${filePath}`)
  } else {
    console.log(`\nRun with --update to apply changes.`)
  }
}

const args = process.argv.slice(2)
const update = args.includes("--update") || args.includes("-u")
const file = args.find((a) => !a.startsWith("-")) ?? "pnpm-workspace.yaml"

checkCatalog(file, update)
