// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import {glob} from "glob"
import {readFile} from "node:fs/promises"
import {basename, resolve} from "node:path"
import {createHighlighter, type Highlighter, type ShikiTransformer} from "shiki"
import * as ts from "typescript"
import type {Plugin} from "vite"

import {
  quiCustomDarkTheme,
  type ReactDemoData,
  type SourceCodeData,
} from "@qualcomm-ui/mdx-common"
import {dedent} from "@qualcomm-ui/utils/dedent"

import {getShikiTransformers} from "../docs-plugin"
import {
  extractPreviewFromHighlightedHtml,
  transformerCodeAttribute,
  transformerPreviewBlock,
} from "../docs-plugin/shiki"
import {shikiTransformerTailwindToInline} from "../docs-plugin/shiki/internal"

import {LOG_PREFIX, VIRTUAL_MODULE_IDS} from "./demo-plugin-constants"
import type {QuiDemoPluginOptions} from "./demo-plugin-types"
import {
  createDemoName,
  extractFileImports,
  extractPageId,
  getScriptKind,
  isCssAsset,
  isDemoFile,
} from "./demo-plugin-utils"

interface HandleUpdateOptions {
  demoName?: string
  filePath: string
}

let highlighter: Highlighter | null = null
let initializingHighlighter = false

const demoRegistry = new Map<string, ReactDemoData>()
const pageFiles = new Map<string, string[]>()
const relativeImportDependents = new Map<string, Set<string>>()

interface HighlightCodeResult {
  full: string
  preview?: string | null
}

/**
 * Generates virtual modules for React demo components. Virtual modules contain
 * highlighted source code and metadata about each demo.
 */
export function reactDemoPlugin({
  demoPattern = "src/routes/**/demos/*.tsx",
  routesDir = "src/routes",
  theme = {
    dark: quiCustomDarkTheme,
    light: "github-light-high-contrast",
  },
  transformers = [],
  transformLine,
  transformTailwindStyles,
}: QuiDemoPluginOptions = {}): Plugin {
  const defaultShikiOptions = {
    defaultColor: "light-dark()",
    lang: "tsx",
    themes: {
      dark: theme.dark,
      light: theme.light,
    },
  }

  return {
    apply(config, env) {
      return (
        (env.mode === "development" && env.command === "serve") ||
        (env.mode === "production" && env.command === "build")
      )
    },
    async buildStart() {
      if (!highlighter && !initializingHighlighter) {
        initializingHighlighter = true
        try {
          highlighter = await createHighlighter({
            langs: ["tsx", "typescript"],
            themes: [theme.dark, theme.light],
          }).finally(() => {
            initializingHighlighter = false
          })
          console.log(
            `${chalk.magenta.bold(LOG_PREFIX)} Shiki highlighter initialized`,
          )
        } catch (error) {
          console.warn(
            `${chalk.magenta.bold(LOG_PREFIX)} Failed to initialize highlighter:`,
            error,
          )
        }
      }

      await collectReactDemos()
    },

    async handleHotUpdate({file, modules, server}) {
      if (isCssAsset(file)) {
        return modules
      }

      if (file.endsWith(".mdx")) {
        return []
      }

      if (isDemoFile(file)) {
        await handleDemoAdditionOrUpdate({filePath: file})
      } else {
        const normalizedFile = resolve(file)
        const dependentDemos = relativeImportDependents.get(normalizedFile)
        if (!dependentDemos?.size) {
          return []
        }
        for (const demoName of Array.from(dependentDemos)) {
          const demo = demoRegistry.get(demoName)
          if (demo) {
            await handleDemoAdditionOrUpdate({
              filePath: demo.filePath,
            })
          }
        }
      }

      const autoModule = server.moduleGraph.getModuleById(
        VIRTUAL_MODULE_IDS.AUTO,
      )
      if (autoModule) {
        server.moduleGraph.invalidateModule(autoModule)
        await server.reloadModule(autoModule)
      }
      return []
    },

    async load(id) {
      if (id === VIRTUAL_MODULE_IDS.AUTO) {
        return generateAutoScopeModule()
      }
    },

    name: "auto-demo-scope",

    resolveId(id) {
      if (id === "virtual:qui-demo-scope/auto") {
        return VIRTUAL_MODULE_IDS.AUTO
      }
    },

    writeBundle() {
      console.log(
        `${chalk.blue.bold(LOG_PREFIX)} Successfully integrated ${chalk.green(demoRegistry.size)} component demos`,
      )
    },
  }

  async function handleDemoAdditionOrUpdate({
    filePath,
  }: HandleUpdateOptions): Promise<void> {
    const pageId = extractPageId(filePath, routesDir)
    const demoName = createDemoName(filePath)

    const existingFiles = pageFiles.get(pageId) ?? []
    if (!existingFiles.includes(filePath)) {
      existingFiles.push(filePath)
      pageFiles.set(pageId, existingFiles)
    }

    const fileData = await extractFileData(filePath)
    if (fileData) {
      demoRegistry.set(demoName, {
        ...fileData,
        demoName,
        pageId,
      })

      const fileImports = await extractFileImports(filePath)
      if (fileImports) {
        for (const relativeImport of fileImports.relativeImports) {
          const dependents =
            relativeImportDependents.get(relativeImport.resolvedPath) ??
            new Set()
          dependents.add(demoName)
          relativeImportDependents.set(relativeImport.resolvedPath, dependents)
        }
      }
    }
  }

  async function highlightCode(
    code: string,
    transformers: ShikiTransformer[] = [],
  ): Promise<HighlightCodeResult> {
    if (!highlighter) {
      return {full: code}
    }
    let previewCode: string | null = null
    try {
      const highlightedCode = highlighter.codeToHtml(code, {
        ...defaultShikiOptions,
        transformers: [
          ...getShikiTransformers(),
          ...transformers,
          transformerPreviewBlock({
            attributeName: "data-preview",
            onComplete: (extractedPreview) => {
              previewCode = extractedPreview
            },
          }),
          transformerCodeAttribute({
            attributeName: "data-code",
          }),
          {
            enforce: "post",
            name: "shiki-transformer-trim",
            preprocess(code) {
              return code.trim()
            },
          },
          ...transformers,
        ],
      })

      return {
        full: highlightedCode,
        preview: previewCode
          ? extractPreviewFromHighlightedHtml(highlightedCode)
          : null,
      }
    } catch (error) {
      console.warn(
        `${chalk.magenta.bold(LOG_PREFIX)} Failed to highlight code:`,
        error,
      )
      return {full: code}
    }
  }

  async function collectReactDemos() {
    if (demoRegistry.size) {
      return
    }

    const demoFiles = (await glob(demoPattern)).filter(isDemoFile)

    for (const filePath of demoFiles) {
      const pageId = extractPageId(filePath, routesDir)
      const existingFiles = pageFiles.get(pageId) ?? []
      existingFiles.push(filePath)
      pageFiles.set(pageId, existingFiles)

      const fileData = await extractFileData(filePath)
      if (fileData) {
        const demoName = createDemoName(filePath)
        demoRegistry.set(demoName, {
          ...fileData,
          pageId,
        })
      }

      const fileImports = await extractFileImports(filePath)
      if (fileImports) {
        for (const relativeImport of fileImports.relativeImports) {
          const demoName = createDemoName(filePath)
          const dependents =
            relativeImportDependents.get(relativeImport.resolvedPath) ??
            new Set()
          dependents.add(demoName)
          relativeImportDependents.set(relativeImport.resolvedPath, dependents)
        }
      }
    }
  }

  function generateAutoScopeModule(): string {
    const registryCode = generateDemoRegistry(demoRegistry)
    return [
      "// Auto-generated demo scope resolver (PROD MODE)",
      registryCode,
      generateExportedFunctions(),
    ].join("\n\n")
  }

  function transformLines(code: string): string {
    if (!transformLine) {
      return code
    }
    const result: string[] = []
    for (const line of code.split("\n")) {
      if (line.trim()) {
        const transformed = transformLine(line)
        if (transformed) {
          result.push(transformed)
        }
      } else {
        // include all empty lines
        result.push(line)
      }
    }
    return result.join("\n")
  }

  async function extractHighlightedCode(
    filePath: string,
    code: string,
  ): Promise<SourceCodeData | null> {
    try {
      const fileName = basename(filePath)

      const promises: Promise<HighlightCodeResult>[] = []
      promises.push(highlightCode(code))

      if (transformTailwindStyles) {
        promises.push(highlightCode(code, [shikiTransformerTailwindToInline()]))
      }

      const [tailwind, inline] = await Promise.all(promises)

      return {
        fileName,
        filePath,
        highlighted: {
          full: tailwind.full,
          preview: tailwind.preview,
        },
      }
    } catch {
      return null
    }
  }

  async function extractFileData(
    filePath: string,
  ): Promise<Omit<ReactDemoData, "pageId"> | null> {
    try {
      const code = await readFile(filePath, "utf-8").then(transformLines)
      const imports = stripImports(code, filePath)

      const sourceCode: SourceCodeData[] = []

      const sourceCodeData = await extractHighlightedCode(filePath, code)

      if (sourceCodeData) {
        sourceCode.push(sourceCodeData)
      }

      const fileImports = await extractFileImports(filePath)
      if (fileImports) {
        for (const relativeImport of fileImports.relativeImports) {
          try {
            const importedCode = await readFile(
              relativeImport.resolvedPath,
              "utf-8",
            ).then(transformLines)

            const sourceCodeData = await extractHighlightedCode(
              relativeImport.resolvedPath,
              importedCode,
            )

            if (sourceCodeData) {
              sourceCode.push(sourceCodeData)
            }
          } catch {
            console.debug("Failed to process file", relativeImport.resolvedPath)
          }
        }
      }

      return {
        demoName: createDemoName(filePath),
        fileName: sourceCodeData?.fileName || basename(filePath),
        filePath,
        imports,
        sourceCode,
      }
    } catch {
      return null
    }
  }

  function stripImports(code: string, fileName: string): string[] {
    try {
      const sourceFile = ts.createSourceFile(
        fileName,
        code,
        ts.ScriptTarget.Latest,
        true,
        getScriptKind(fileName),
      )

      const importRanges: Array<{end: number; start: number}> = []

      function visit(node: ts.Node) {
        if (ts.isImportDeclaration(node)) {
          importRanges.push({
            end: node.getEnd(),
            start: node.getFullStart(),
          })
        }
        ts.forEachChild(node, visit)
      }

      visit(sourceFile)

      return importRanges.map((range) => {
        let endPos = range.end
        if (code[endPos] === "\n") {
          endPos++
        }
        return code.slice(range.start, endPos).trim()
      })
    } catch (error) {
      return []
    }
  }

  function generateDemoRegistry(registry: Map<string, ReactDemoData>): string {
    const entries = Array.from(registry.entries())
      .map(([demoName, {fileName, imports, pageId, sourceCode}]) => {
        return `  ["${demoName}", { fileName: "${fileName}", imports: ${JSON.stringify(imports)}, pageId: "${pageId}", sourceCode: ${JSON.stringify(sourceCode)}, demoName: "${demoName}" }]`
      })
      .join(",\n")
    return `const demoRegistry = new Map([\n${entries}\n])`
  }

  function generateExportedFunctions(): string {
    return dedent`
    export function getDemo(demoName) {
      const demo = demoRegistry.get(demoName)
      if (!demo) {
        return {
          fileName: "",
          imports: [],
          errorMessage: \`Demo "\${demoName}" not found.\`,
          pageId: "",
          sourceCode: [],
        }
      }
      return demo
    }
  `
  }
}
