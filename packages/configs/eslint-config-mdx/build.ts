import type {BuildOptions} from "esbuild"

import {buildOrWatch, hasArg, logPlugin} from "@qualcomm-ui/esbuild"

import pkg from "./package.json"

async function build(argv: string[]) {
  const IS_WATCH = hasArg(argv, "--watch")

  const buildOpts: BuildOptions = {
    bundle: true,
    entryPoints: [
      "./src/index.ts",
      "./src/remark-lint-code-format.ts",
      "./src/remark-lint-mdx-jsx-format.ts",
      "./src/remark-preserve-alert-markers.ts",
      "./src/remarkrc.ts",
    ],
    external: [
      ...Object.keys(pkg.devDependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ],
    format: "esm",
    metafile: true,
    outdir: "./dist",
    platform: "node",
    plugins: [logPlugin({bundleSizeOptions: {logMode: "all"}})],
    sourcemap: true,
    target: "es2022",
    tsconfig: "tsconfig.lib.json",
  }

  await buildOrWatch(buildOpts, IS_WATCH)
}

build(process.argv)
