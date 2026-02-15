import {access, mkdir, writeFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = dirname(__filename) // get the name of the directory

const cwd = resolve(__dirname, "../")

/**
 * async version of the fs.exists module.
 */
async function exists(path, mode) {
  return access(path, mode)
    .then(() => true)
    .catch(() => false)
}

// set up typedoc files if not yet initialized
await Promise.all(
  // TODO: add back once docs sites are moved over
  // ["react-docs", "react-mdx-docs", "react-table-docs", "angular-docs"].map(
  [].map(async (pkg) => {
    const pkgPath = resolve(cwd, "packages/docs", pkg)
    const typedocPath = resolve(pkgPath, ".typedoc")
    const docPropsPath = resolve(pkgPath, ".typedoc/doc-props.json")

    await mkdir(typedocPath, {recursive: true})

    if (!(await exists(docPropsPath))) {
      await writeFile(docPropsPath, JSON.stringify({props: {}}), "utf-8")
    }
  }),
)
