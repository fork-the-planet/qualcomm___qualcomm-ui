// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import chokidar from "chokidar"
import {glob} from "glob"
import {readFileSync} from "node:fs"
import {join, resolve} from "node:path"
import prettyMilliseconds from "pretty-ms"
import type {PluginOption, ResolvedConfig, ViteDevServer} from "vite"

import type {
  KnowledgePageData,
  PageDocProps,
  SiteData,
} from "@qualcomm-ui/mdx-common"
import type {QuiPropTypes} from "@qualcomm-ui/typedoc-common"

import {generate} from "../open-web-ui-knowledge/generate-knowledge"

import {
  type CompiledMdxFile,
  ConfigLoader,
  fixPath,
  type ResolvedQuiDocsConfig,
  SearchIndexer,
} from "./internal"

const isDev = process.env.NODE_ENV === "development"

interface ChangeOptions {
  onComplete?: () => void
}

export interface QuiDocsPluginOptions {
  /**
   * Path to the qui-docs config file. This is automatically detected if omitted.
   */
  configFile?: string

  /**
   * The current working directory.
   *
   * @default process.cwd()
   */
  cwd?: string
}

const VIRTUAL_MODULE_ID = "\0@qualcomm-ui/mdx-vite-plugin"

interface ExportsState {
  basePath: string
  enabled: boolean
  pages: KnowledgePageData[]
}

/**
 * TODO: adjust when https://github.com/vitejs/vite/discussions/16358 lands.
 */
class PluginState {
  buildCount: number = 0
  config: ResolvedQuiDocsConfig | null = null
  configFilePath: string = ""
  docPropsFilePath: string = ""
  exports: ExportsState = {basePath: "", enabled: false, pages: []}
  indexer!: SearchIndexer
  configLoader: ConfigLoader | null = null
  knowledgeConfig: ResolvedQuiDocsConfig["knowledge"] = undefined
  routesDir!: string
  servers: ViteDevServer[] = []
  timeout: ReturnType<typeof setTimeout> | undefined = undefined
  exportsTimeout: ReturnType<typeof setTimeout> | undefined = undefined
  watching = false

  private cwd!: string

  init(cwd: string) {
    this.cwd = cwd
  }

  getCwd() {
    return this.cwd
  }

  get docPropsDirectory() {
    if (!this.docPropsFilePath) {
      return ""
    }
    return this.docPropsFilePath.substring(
      0,
      this.docPropsFilePath.lastIndexOf("/"),
    )
  }

  get siteData(): SiteData & {
    config: Omit<ResolvedQuiDocsConfig, "filePath">
    exports: ExportsState
  } {
    const {filePath: _filePath, ...config} =
      this.config ?? ({} as ResolvedQuiDocsConfig)
    return {
      config,
      exports: this.exports,
      navItems: state.indexer.navItems,
      pageDocProps: state.indexer.pageDocProps as unknown as PageDocProps,
      pageMap: state.indexer.pageMap,
      searchIndex: state.indexer.searchIndex,
    }
  }

  private resolveDocProps(): Record<string, QuiPropTypes> {
    if (!this.docPropsFilePath) {
      return {}
    }
    try {
      return JSON.parse(readFileSync(this.docPropsFilePath, "utf-8"))?.props
    } catch (e) {
      console.debug(
        "Invalid doc props file. Unable to parse JSON. Please check the file",
      )
      return {}
    }
  }

  createIndexer(config: ResolvedQuiDocsConfig) {
    this.config = config
    this.configFilePath = config.filePath
    this.docPropsFilePath = config.typeDocProps
      ? fixPath(resolve(this.cwd, config.typeDocProps))
      : ""
    this.routesDir = fixPath(resolve(config.appDirectory, config.pageDirectory))
    this.knowledgeConfig = config.knowledge
    this.indexer = new SearchIndexer({
      ...config,
      srcDir: fixPath(resolve(this.cwd, config.appDirectory)),
      typeDocProps: this.resolveDocProps(),
    })

    const exportsConfig = config.knowledge?.global?.exports
    const exportsEnabled = exportsConfig?.enabled ?? false
    const exportsPath = exportsConfig?.staticPath ?? "exports/md"
    this.exports = {
      basePath: exportsEnabled ? `/${exportsPath}` : "",
      enabled: exportsEnabled,
      pages: [],
    }
  }

  buildIndex(shouldLog: boolean): CompiledMdxFile[] {
    const files = glob.sync(
      [`${this.routesDir}/**/*.mdx`, `${this.routesDir}/**/*.tsx`],
      {
        absolute: true,
        cwd: this.cwd,
      },
    )

    if (!files.length) {
      return []
    }

    const startTime = Date.now()

    const compiledMdxFiles = this.indexer.buildIndex(files, shouldLog)

    if (isDev && shouldLog) {
      console.debug(
        `${chalk.magenta.bold(`@qualcomm-ui/mdx-vite/docs-plugin:`)} Compiled search index in: ${chalk.blueBright.bold(prettyMilliseconds(Date.now() - startTime))}${state.indexer.cachedFileCount ? chalk.greenBright.bold(` (${state.indexer.cachedFileCount}/${state.indexer.mdxFileCount} files cached)`) : ""}`,
      )
    }

    return compiledMdxFiles
  }

  /**
   * When the user adds or removes mdx files, we re-index the site. This function
   * handles module invalidation so that virtual file imports are refreshed as
   * expected by the consumer's dev server.
   */
  sendUpdate() {
    for (const server of this.servers) {
      const virtualModule = server.moduleGraph.getModuleById(VIRTUAL_MODULE_ID)
      if (virtualModule) {
        server.moduleGraph.invalidateModule(virtualModule)
        server.reloadModule(virtualModule)
      }
    }
  }

  handleChange(opts: ChangeOptions = {}) {
    // the plugin is activating twice in dev mode. It's mostly harmless, but we
    // prevent logs from emitting twice by flipping a flag

    // debounce the change handler to prevent rapid updates from triggering rebuilds
    // in quick succession.
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.buildIndex(true)
      this.sendUpdate()
      opts?.onComplete?.()
    }, 300)
  }

  initWatchers(configFile?: string) {
    if (this.watching) {
      return
    }
    this.initConfigWatcher(configFile)
    this.watching = true
  }

  private initConfigWatcher(configFile?: string) {
    const paths: string[] = [this.configFilePath]
    if (this.docPropsFilePath) {
      paths.push(this.docPropsFilePath)
    }
    chokidar
      .watch(paths, {
        cwd: this.cwd,
      })
      .on("change", () => {
        console.debug(`qui-docs config changed, reloading plugin`)
        this.configLoader = new ConfigLoader({configFile})
        const resolvedConfig = this.configLoader.loadConfig()
        this.configFilePath = resolvedConfig.filePath
        this.createIndexer(resolvedConfig)
        this.handleChange({
          onComplete: () => {
            this.servers.forEach((server) =>
              server.ws.send({type: "full-reload"}),
            )
          },
        })
      })
  }

  async generateExports(publicDir: string): Promise<void> {
    if (!this.exports.enabled || !this.knowledgeConfig?.global) {
      return
    }

    const globalConfig = this.knowledgeConfig.global
    const exportsConfig = globalConfig.exports ?? {}
    const exportsPath = exportsConfig.staticPath ?? "exports/md"
    const outputPath = join(publicDir, exportsPath)

    const startTime = Date.now()

    const pageIds = await generate({
      baseUrl: globalConfig.baseUrl,
      clean: true,
      docPropsPath: this.docPropsFilePath || undefined,
      exclude: exportsConfig.exclude ?? globalConfig.exclude,
      extraFiles: exportsConfig.extraFiles ?? globalConfig.extraFiles,
      metadata: exportsConfig.metadata ?? globalConfig.metadata,
      outputMode: "per-page",
      outputPath,
      pageTitlePrefix:
        exportsConfig.pageTitlePrefix ?? globalConfig.pageTitlePrefix,
      routeDir: this.routesDir,
    })

    this.exports.pages = pageIds

    console.debug(
      `${chalk.magenta.bold(`@qualcomm-ui/mdx-vite/docs-plugin:`)} Generated Markdown exports in: ${chalk.blueBright.bold(prettyMilliseconds(Date.now() - startTime))}`,
    )
  }

  debouncedGenerateExports(publicDir: string): void {
    if (!this.exports.enabled) {
      return
    }
    clearTimeout(this.exportsTimeout)
    this.exportsTimeout = setTimeout(() => {
      void this.generateExports(publicDir)
    }, 500)
  }
}

const state = new PluginState()

export function quiDocsPlugin(opts?: QuiDocsPluginOptions): PluginOption {
  state.init(fixPath(opts?.cwd ?? process.cwd()))

  // https://vitejs.dev/guide/api-plugin#virtual-modules-convention

  const configLoader = new ConfigLoader(opts || {})
  const config = configLoader.loadConfig()
  state.createIndexer(config)

  let viteConfig: ResolvedConfig

  return {
    apply(config, env) {
      return (
        (env.mode === "development" && env.command === "serve") ||
        (env.mode === "production" && env.command === "build")
      )
    },
    buildStart: async () => {
      state.buildIndex(state.buildCount > 0)
      state.buildCount++

      if (!isDev && state.exports.enabled) {
        const publicDir = viteConfig.publicDir || join(state.getCwd(), "public")
        await state.generateExports(publicDir)
      }
    },
    configResolved(resolved) {
      viteConfig = resolved
    },
    configureServer: async (server) => {
      if (!isDev) {
        return
      }
      state.initWatchers(opts?.configFile)

      if (state.exports.enabled) {
        const publicDir = join(state.getCwd(), "public")
        await state.generateExports(publicDir)
      }

      server.watcher.on("add", (path: string) => {
        if (path.endsWith(".mdx")) {
          const publicDir = join(state.getCwd(), "public")
          state.handleChange({
            onComplete: () => {
              server.ws.send({type: "full-reload"})
              state.debouncedGenerateExports(publicDir)
            },
          })
        }
      })
      server.watcher.on("unlink", (path: string) => {
        if (path.endsWith(".mdx")) {
          const publicDir = join(state.getCwd(), "public")
          state.handleChange({
            onComplete: () => {
              server.ws.send({type: "full-reload"})
              state.debouncedGenerateExports(publicDir)
            },
          })
        }
      })
      state.servers.push(server)
    },
    handleHotUpdate: async ({file: updateFile, modules, server}) => {
      if (updateFile.endsWith(".css")) {
        return modules
      }
      const file = fixPath(updateFile)
      if (
        (!config.hotUpdateIgnore || !config.hotUpdateIgnore.test(file)) &&
        // ignore watched files. We watch for these separately.
        file !== state.configFilePath
      ) {
        if (
          state.docPropsDirectory &&
          file.startsWith(state.docPropsFilePath)
        ) {
          return []
        }

        if (updateFile.endsWith(".mdx")) {
          const files = state.buildIndex(true)

          const moduleByFile = server.moduleGraph.getModulesByFile(updateFile)
          if (!moduleByFile?.size) {
            console.debug("no module found for file, returning", updateFile)
            return []
          }

          const virtualModule =
            server.moduleGraph.getModuleById(VIRTUAL_MODULE_ID)
          if (virtualModule) {
            // invalidate the module so that it gets re-evaluated on next refresh
            server.moduleGraph.invalidateModule(virtualModule)

            // Send the updated site data to the site so that it has the latest
            // state.
            server.ws.send({
              data: state.siteData,
              event: "qui-docs-plugin:refresh-site-data",
              type: "custom",
            })
          }
          if (files.some((file) => file.metadata.changed.frontmatter)) {
            console.debug(
              "Frontmatter changed, reloading plugin to reflect changes in the page configuration",
            )
            if (virtualModule) {
              server.moduleGraph.invalidateModule(virtualModule)
            }
            server.ws.send({type: "full-reload"})
            return []
          }
          return virtualModule ? [virtualModule] : []
        }
      }
      return []
    },
    load: (id): string | undefined => {
      if (id === VIRTUAL_MODULE_ID) {
        return `export const siteData = ${JSON.stringify(state.siteData)}`
      }
      return undefined
    },
    name: "qui-mdx-vite-plugin",
    resolveId: (id) => {
      if (id === "@qualcomm-ui/mdx-vite-plugin") {
        return VIRTUAL_MODULE_ID
      }
      return undefined
    },
  }
}
