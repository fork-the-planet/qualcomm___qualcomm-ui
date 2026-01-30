#!/usr/bin/env node

import {Command} from "@commander-js/extra-typings"
import {client} from "@figma/code-connect"
import {chunk, sortBy, uniqBy} from "lodash-es"
import {mkdir, writeFile} from "node:fs/promises"
import path from "node:path"

import {dedent} from "@qualcomm-ui/utils/dedent"

import {logger, LogLevel} from "./logger.js"

const program = new Command()
  .name("code-connect")
  .description("CLI for fetching Figma nodes for Code Connect")
  .version("1.0.0")

program
  .command("fetch")
  .description("Fetch all components from a Figma page")
  .argument("<url>", "Figma file or page URL")
  .option("-n, --node-id <id>", "Specific node ID to fetch")
  .option("-o, --out <file>", "Write JSON output to file")
  .option("-v, --verbose", "Enable verbose logging", false)
  .action(async (url, options) => {
    if (options.verbose) {
      logger.setLogLevel(LogLevel.Debug)
    }

    if (!process.env.FIGMA_ACCESS_TOKEN) {
      logger.error("FIGMA_ACCESS_TOKEN environment variable is not set")
      process.exit(1)
    }

    try {
      const fetchUrl = options.nodeId ? `${url}?node-id=${options.nodeId}` : url
      const components = await client.getComponents(fetchUrl)
      const json = JSON.stringify(components, null, 2)

      if (options.out) {
        await writeFile(options.out, json)
        logger.info(`Wrote ${components.length} components to ${options.out}`)
      } else {
        console.log(json)
      }
    } catch (error) {
      logger.error(
        `Failed to fetch components: ${error instanceof Error ? error.message : String(error)}`,
      )
      process.exit(1)
    }
  })

program
  .command("generate-icons")
  .description("Generate Code Connect files for icon components")
  .argument("<url>", "Figma file or page URL containing icons")
  .option("-o, --out <dir>", "Output directory", "generated/figma/icons")
  .option("-v, --verbose", "Enable verbose logging", false)
  .action(async (url, options) => {
    if (options.verbose) {
      logger.setLogLevel(LogLevel.Debug)
    }

    if (!process.env.FIGMA_ACCESS_TOKEN) {
      logger.error("FIGMA_ACCESS_TOKEN environment variable is not set")
      process.exit(1)
    }

    try {
      const components = await client.getComponents(url)

      const icons = uniqBy(
        components.filter((c) => c.name.startsWith("utl/")),
        (obj) => obj.name,
      )
      if (icons.length === 0) {
        logger.warn(
          "No icon components found (expected names starting with 'utl/')",
        )
        process.exit(0)
      }

      logger.info(`Found ${icons.length} icon components`)

      await mkdir(options.out, {recursive: true})

      const codeConnects: IconCodeConnect[] = sortBy(
        icons.map((icon) => {
          const iconName = toPascalCase(icon.name.replace(/^utl\//, ""))
          const props = icon.componentPropertyDefinitions
          const sizeProp = props.size || props.Size
          let figmaProps: string | undefined = undefined
          if (sizeProp && (sizeProp.type as string) === "VARIANT") {
            // inconsistent naming in the Figma icons file. (>_>)
            figmaProps = dedent`
              {iconName: "${iconName}", size: figma.enum("${props.size ? "size" : "Size"}", ${JSON.stringify(
                sizeProp.variantOptions?.reduce(
                  (acc: Record<string, string>, current) => {
                    acc[current] = current
                    return acc
                  },
                  {},
                ),
              )})}
            `
          }
          return {
            figmaNodeId: encodeURIComponent(icon.id),
            iconName,
            props: figmaProps,
          }
        }),
        (icon) => icon.iconName,
      )

      const batches: IconCodeConnect[][] = chunk(codeConnects, 100)

      await Promise.all(
        batches.map(async (batch, index) => {
          const suffix = batches.length > 1 ? `-${index + 1}` : ""
          const outputFile = path.join(options.out, `icons${suffix}.figma.tsx`)
          const content = generateIconsFile(batch)
          await writeFile(outputFile, content)
          logger.info(`Generated ${outputFile} with ${batch.length} icons`)
        }),
      )

      logger.info(
        `Generated ${batches.length} file(s) with ${icons.length} total icons`,
      )
    } catch (error) {
      logger.error(
        `Failed to generate icons: ${error instanceof Error ? error.message : String(error)}`,
      )
      process.exit(1)
    }
  })

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("")
}

interface IconCodeConnect {
  figmaNodeId: string
  iconName: string
  props: string | undefined
}

function generateIconsFile(icons: IconCodeConnect[]): string {
  const imports = icons.map((i) => i.iconName).join(", ")
  const connects = icons
    .map((i) =>
      dedent(`
        figma.connect(${i.iconName}, "<FIGMA_ICONS_BASE>?node-id=${i.figmaNodeId}", {
          imports: ['import {${i.iconName}} from "lucide-react"'],
          props: ${i.props},
        })
      `),
    )
    .join("\n\n")

  return dedent`
    /* eslint-disable */
    // this file was automatically generated, do not edit it directly

    import figma from "@figma/code-connect"
    import {${imports}} from "lucide-react"
    
    ${connects}
  `
}

program.parse()
