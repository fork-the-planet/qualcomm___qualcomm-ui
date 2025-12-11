// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Option, program} from "@commander-js/extra-typings"
import {writeFile} from "node:fs/promises"

import {
  allTailwindTransforms,
  ExportAnalyzer,
  reactRouterUtils,
} from "./modules"
import {processDirs} from "./process-dirs"
import {type ImportTransformEntry, processClassTransforms} from "./transformers"

const logModeOpt = new Option("--log-mode <logMode>", "Log mode")
  .choices(["info", "verbose"])
  .default("info")

const directoryOption = new Option(
  "-d, --dir <directory>",
  "Directory to process (supports file globs)",
).makeOptionMandatory()

const dryRunOption = new Option(
  "--dry-run",
  "Preview changes without writing files",
)

function addMigration(name: string, transforms: ImportTransformEntry[]) {
  return program
    .command(name)
    .addOption(directoryOption)
    .addOption(logModeOpt)
    .addOption(dryRunOption)
    .summary(`Update @qualcomm-ui/${name} imports to the latest version`)
    .action(async (opts) => {
      return processDirs(transforms, {...opts, dryRun: opts.dryRun ?? false})
    })
}

addMigration("react-router-utils", reactRouterUtils)

program
  .command("analyze-exports")
  .addOption(directoryOption)
  .option(
    "-p, --package-name <packageName>",
    "Package name, used to generate migration config",
  )
  .action(async (opts) => {
    const analyzer = new ExportAnalyzer().analyzeDirectory(opts.dir)
    if (opts.packageName) {
      const config = analyzer.createMigrationConfig(opts.packageName)
      await writeFile(
        "./migration-config.json",
        JSON.stringify(config, null, 2),
        "utf-8",
      )
    } else {
      analyzer.printReport()
    }
  })

program
  .command("tailwind")
  .addOption(directoryOption)
  .addOption(logModeOpt)
  .option("--dry-run", "Preview changes without writing files")
  .summary("Migrate Tailwind classes from @qui/tailwind-plugin to QDS tokens")
  .description(
    `Migrates CSS class names from the old QUI Tailwind plugin to the new QDS token-based system. This requires Tailwind v4.

Supported file types:
  - React: .tsx, .jsx (className, cn(), clsx(), cva())
  - Angular: .html, .ts (class attribute, host bindings)
  - CSS/SCSS: .css, .scss (@apply directives, class selectors)

Examples:
  qui-codemod tailwind -d "src/**"
  qui-codemod tailwind -d "src/**" --dry-run
  qui-codemod tailwind -d "src/components/**/*.tsx" --log-mode verbose`,
  )
  .action(async (opts) => {
    const dryRun = opts.dryRun ?? false
    const logMode = opts.logMode

    console.log(
      dryRun
        ? "Running in dry-run mode (no files will be modified)...\n"
        : "Migrating Tailwind classes...\n",
    )

    const result = await processClassTransforms(
      [opts.dir],
      allTailwindTransforms,
      {dryRun, logMode},
    )

    console.log("\n---")
    console.log(
      `Summary: ${result.totalChanges} changes in ${result.filesChanged} file(s)`,
    )
    if (dryRun) {
      console.log("(dry-run, no files modified)")
    }
  })

program.parse(process.argv)
