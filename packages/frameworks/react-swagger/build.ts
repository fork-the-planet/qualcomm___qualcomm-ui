import type {BuildOptions} from "esbuild"

import {buildOrWatch, hasArg, logPlugin} from "@qualcomm-ui/esbuild"

import pkg from "./package.json"

async function build(argv: string[]) {
  const buildOpts: BuildOptions = {
    banner: {
      js: `"use client";`,
    },
    bundle: true,
    entryPoints: ["./src/index.ts"],
    external: [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
      "@tanstack/virtual-core",
    ],
    metafile: true,
    minifyIdentifiers: false,
    minifySyntax: true,
    minifyWhitespace: true,
    outdir: "dist",
    platform: "node",
    sourcemap: true,
    target: "es2023",
    tsconfig: "tsconfig.lib.json",
  }

  const watch = hasArg(argv, "--watch")

  await buildOrWatch(
    {
      ...buildOpts,
      format: "esm",
      logLevel: watch ? "error" : "warning",
      plugins: [logPlugin({bundleSizeOptions: {logMode: "both"}})],
    },
    watch,
  )
}

build(process.argv)
