import {program} from "@commander-js/extra-typings"

import type {KnowledgePageData} from "@qualcomm-ui/mdx-common"

import {loadEnv} from "../common"
import {loadEnvironmentConfigs} from "../load-config-from-env"
import type {AiKnowledgeConfig, CliConfig} from "../types"

import {KnowledgeGenerator} from "./knowledge-generator"

/**
 * Generates knowledge documentation from MDX files.
 * Returns an array of pages that were generated.
 */
export async function generate(
  config: AiKnowledgeConfig,
): Promise<KnowledgePageData[]> {
  const generator = new KnowledgeGenerator(config)
  return generator.run()
}

export function addGenerateKnowledgeCommand() {
  program
    .description("Generate llms.txt from QUI Docs documentation")
    .command("generate-llms-txt")
    .option("-n, --name <name>", "Project name for llms.txt header")
    .requiredOption("-m, --output-mode <outputMode>")
    .option("-o, --outputPath <outputPath>", "Output file or directory.")
    .option(
      "-d, --description <description>",
      "Project description for llms.txt",
    )
    .option("-v, --verbose", "Enable verbose logging", false)
    .option(
      "--exclude <patterns...>",
      "Glob patterns to exclude (e.g., **/internal/**, guide/drafts/*)",
      [],
    )
    .option("--base-url <url>", "Base URL for component documentation links")
    .option("--metadata <pairs...>", "metadata key-value pairs")
    .option("--clean", "Clean the output path before generating")
    .option("--include-imports", "Include relative import source files", true)
    .option(
      "-e, --environment <environments>",
      "Comma-separated list of environments to generate (default: all)",
    )
    .action(async (options) => {
      loadEnv()

      const cliOptions: CliConfig = {
        ...options,
        outputMode:
          options.outputMode === "per-page" ? "per-page" : "aggregated",
      }

      const environmentFilter = options.environment
        ?.split(",")
        .map((e) => e.trim())
        .filter(Boolean)

      const configs = loadEnvironmentConfigs({
        cliOptions,
        environments: environmentFilter,
      })

      for (const config of configs) {
        const envLabel = config.environmentName
          ? `[${config.environmentName}] `
          : ""
        console.log(`${envLabel}Generating knowledge to ${config.outputPath}`)
        await generate(config)
      }

      if (configs.length > 1) {
        console.log(
          `\nGenerated knowledge for ${configs.length} environment(s)`,
        )
      }
    })
}
