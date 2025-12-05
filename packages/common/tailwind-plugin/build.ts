import type {BuildOptions} from "esbuild"
import {writeFile} from "node:fs/promises"

import {
  buildOrWatch,
  collectFolders,
  hasArg,
  logPlugin,
} from "@qualcomm-ui/esbuild"

import pkg from "./package.json"

async function collectEntryPoints() {
  // Create an object with output names as keys and entry points as values
  return (await collectFolders("./src")).reduce(
    (acc: Record<string, string>, name) => {
      acc[`${name}/index`] = `./src/${name}/index.ts`
      return acc
    },
    {},
  )
}

async function main(argv: string[]) {
  const IS_WATCH = hasArg(argv, "--watch")

  const buildOpts: BuildOptions = {
    bundle: true,
    entryPoints: await collectEntryPoints(),
    external: [
      ...Object.keys(pkg.devDependencies),
      ...Object.keys(pkg.peerDependencies),
    ],
    metafile: true,
    outdir: "dist",
    platform: "node",
    plugins: [logPlugin({bundleSizeOptions: {logMode: "both"}})],
    sourcemap: true,
    target: "es2023",
    tsconfig: "tsconfig.lib.json",
  }

  await buildOrWatch(
    {
      ...buildOpts,
      format: "esm",
      logLevel: IS_WATCH ? "error" : "warning",
      plugins: [
        logPlugin({bundleSizeOptions: {logMode: "both"}}),
        {
          name: "generate metafile",
          setup(build) {
            build.onEnd(async (res) => {
              await writeFile(
                "build-metafile.json",
                JSON.stringify(res.metafile),
                "utf-8",
              )
            })
          },
        },
      ],
    },
    IS_WATCH,
  )
}

main(process.argv)
