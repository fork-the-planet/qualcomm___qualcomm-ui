import type {BuildOptions} from "esbuild"

import {buildOrWatch, getArg, hasArg} from "@qualcomm-ui/esbuild"

async function main(argv: string[]) {
  const IS_WATCH = hasArg(argv, "--watch")
  const BUILD_MODE = getArg(argv, "--mode") || "production"

  const external: string[] = [
    "@commander-js/extra-typings",
    "cosmiconfig",
    "oxfmt",
    "typedoc",
    "typescript",
  ]

  const buildOpts: BuildOptions = {
    bundle: true,
    define: {
      "process.env.BUILD_MODE": JSON.stringify(BUILD_MODE),
    },
    external,
    loader: {
      ".node": "copy",
    },
    logLevel: "error",
    platform: "node",
    sourcemap: true,
    target: "esnext",
    tsconfig: "tsconfig.lib.json",
  }

  await Promise.all([
    buildOrWatch(
      {
        ...buildOpts,
        banner: {js: "#!/usr/bin/env node"},
        entryPoints: ["./src/cli.ts"],
        external,
        format: "esm",
        logLevel: IS_WATCH ? "error" : "warning",
        metafile: true,
        outfile: "./dist/cli.js",
      },
      IS_WATCH,
    ),
    buildOrWatch(
      {
        ...buildOpts,
        entryPoints: ["./src/index.ts"],
        format: "esm",
        outfile: "./dist/index.js",
      },
      IS_WATCH,
    ),
  ])
}

main(process.argv)
