import esbuild, {type BuildOptions} from "esbuild"

import pkg from "./package.json"

function hasArg(argv: string[], key: string) {
  return argv.includes(key)
}

async function buildOrWatch(options: BuildOptions, watch: boolean) {
  if (watch) {
    await esbuild.context(options).then((ctx) => ctx.watch())
  } else {
    await esbuild.build(options)
  }
}

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
    outfile: "./dist/index.js",
    platform: "node",
    sourcemap: true,
    target: "es2022",
    tsconfig: "tsconfig.lib.json",
  }

  console.log("[build.ts] building...")
  await buildOrWatch(buildOpts, IS_WATCH)
  console.log("[build.ts] done")
}

build(process.argv)
