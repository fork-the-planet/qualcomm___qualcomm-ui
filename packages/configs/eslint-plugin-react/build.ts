import type {BuildOptions} from "esbuild"

import {buildOrWatch, hasArg, logPlugin} from "@qualcomm-ui/esbuild"

import pkg from "./package.json"

async function build(argv: string[]) {
  const IS_WATCH = hasArg(argv, "--watch")

  const buildOpts: BuildOptions = {
    bundle: true,
    entryPoints: ["./src/index.ts"],
    external: [
      ...Object.keys(pkg.devDependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ],
    format: "esm",
    metafile: true,
    outfile: "./dist/index.js",
    platform: "node",
    plugins: [logPlugin({bundleSizeOptions: {logMode: "all"}})],
    sourcemap: true,
    target: "es2022",
    tsconfig: "tsconfig.lib.json",
  }

  console.log("[build.ts] building...")
  await buildOrWatch(buildOpts, IS_WATCH)
  console.log("[build.ts] done")
}

build(process.argv)
