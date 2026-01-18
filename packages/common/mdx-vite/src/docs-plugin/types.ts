// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  KnowledgePageData,
  PageFrontmatter,
  TocHeading,
} from "@qualcomm-ui/mdx-common"
import type {QuiPropTypes} from "@qualcomm-ui/typedoc-common"

export type RoutingStrategy =
  | "vite-generouted"
  | ((filePath: string) => string[])

/**
 * Controls how page timestamp metadata is populated from git history.
 * - "off": No timestamp data is added
 * - "timestamp": Only `updatedOn` is populated
 * - "user-and-timestamp": Both `updatedOn` and `updatedBy` are populated
 */
export type PageTimestampMetadataMode =
  | "off"
  | "timestamp"
  | "user-and-timestamp"

/**
 * Side nav item data.
 */
export interface NavMeta {
  id?: never

  /**
   * A label that describes a group of nav items.
   */
  sectionTitle?: string

  /**
   * Render a horizontal separator.
   */
  separator?: boolean
}

export interface RouteMetaEntryInternal
  extends Pick<
    PageFrontmatter,
    | "group"
    | "hideToc"
    | "hideSideNav"
    | "hideFromSearch"
    | "hideBreadcrumbs"
    | "hidePageLinks"
    | "hidden"
    | "sideNavTitle"
  > {
  /**
   * Nested routes.
   */
  children?: RouteMetaInternal

  /**
   * If `true`, the side nav item will be expanded on initial load. Does nothing if
   * the entry is a leaf node.
   */
  expanded?: boolean

  /**
   * Order for the groups within this item's hierarchy.
   */
  groupOrder?: string[]

  /**
   * If specified, the route will be sorted amongst adjacent routes in this order.
   * Adjacent routes are routes at the same depth that share a parent.
   */
  order?: number

  /**
   * If `true`, the route will be flagged as restricted. This flag does nothing
   * internally. You will need to handle this in your application.
   */
  restricted?: boolean

  /**
   * This property is only available for top-level items.
   */
  sectionTitle?: never

  /**
   * This property is only available for top-level items.
   */
  separator?: never

  /**
   * The title of the item in the side nav. Will be parsed from the page's
   * frontmatter if it is not defined in the RouteMeta.
   */
  title?: string
}

export interface RouteMetaNavInternal {
  /**
   * A label that renders above the item's content.
   */
  sectionTitle?: string

  /**
   * Whether to render this item as a separator. If this property is supplied, a
   * horizontal separator will be drawn and all content will be ignored.
   */
  separator?: boolean
}

export type RouteMetaInternal = Record<string, RouteMetaEntryInternal>

export type NavConfig = RouteMeta | NavMeta

export interface RouteMeta
  extends Omit<RouteMetaEntryInternal, "children" | "order"> {
  /**
   * Nested routes.
   *
   * @inheritDoc
   */
  children?: RouteMeta[]

  /**
   * The path segment for this route.
   */
  id: string

  /**
   * By default, pages with a RouteMeta are ordered before pages that are not
   * defined. Set this property to `true` to disable that behavior.
   *
   * @default false
   */
  ignoreRouteMetaOrder?: boolean
}

export interface QuiDocsTypeDocOptions {
  /**
   * Whether to include each page's TypeDocProps property documentation in the
   * search index. If this is true, the property documentation for each occurrence
   * of `<TypeDocProps />` will be built into the search index.
   */
  includeInSearchIndex?: boolean | undefined
}

export interface KnowledgeIntegrationConfig {
  /**
   * Base URL for documentation links in the generated output.
   */
  baseUrl?: string

  /**
   * Description for the knowledge output.
   */
  description?: string

  /**
   * Glob patterns to exclude, relative to the resolved page directory. Supports
   * full glob syntax via minimatch.
   *
   * @example
   * ```ts
   * exclude: ['**\/internal/**', 'guide/drafts/*', '*.draft.mdx']
   * ```
   */
  exclude?: string[]

  /**
   * Configuration for per-page Markdown exports served from the public directory.
   *
   * @inheritDoc
   */
  exports?: KnowledgeExportsConfig

  /**
   * Extra files to include in knowledge output beyond the generated page content.
   */
  extraFiles?: KnowledgeExtraFile[]

  /**
   * List of frontmatter fields to include in the generated Markdown output. These
   * will be copied from each page's frontmatter, if present. Supply as a function
   * and return the modified frontmatter object, which will be included instead.
   */
  frontmatterFields?:
    | string[]
    | ((
        frontmatter: Record<string, string>,
        page: KnowledgePageData,
      ) => Record<string, string | undefined>)

  /**
   * Metadata key-value pairs to include in per-page output.
   */
  metadata?: Record<string, string>

  /**
   * Name for the knowledge output.
   */
  name?: string

  /**
   * Output mode for knowledge generation.
   */
  outputMode?: "per-page" | "aggregated"

  /**
   * Output path for generated knowledge files.
   */
  outputPath?: string

  /**
   * Prefix to prepend to each page ID.
   */
  pageIdPrefix?: string

  /**
   * Prefix to prepend to each page title.
   */
  pageTitlePrefix?: string
}

/**
 * Extra content to include in knowledge output. Assumed to be Markdown.
 */
export interface KnowledgeExtraFile {
  /**
   * The Markdown content for this file.
   */
  contents: string

  /**
   * Unique identifier for this file, used for the output filename.
   */
  id: string

  /**
   * Whether to process this file as MDX content, replacing relative URLs and
   * applying other transformations as if the file were authored as mdx
   * documentation.
   */
  processAsMdx?: boolean

  /**
   * Display title for this content.
   */
  title?: string
}

/**
 * Configuration for per-page Markdown exports. Inherits from parent
 * KnowledgeIntegrationConfig unless overridden.
 */
export interface KnowledgeExportsConfig {
  /**
   * Enable per-page markdown exports. When true, generates downloadable
   * markdown files during build and exposes export metadata in siteData.
   *
   * @default false
   */
  enabled?: boolean

  /**
   * Glob patterns to exclude from exports. Overrides the parent exclude config.
   */
  exclude?: string[]

  /**
   * Extra files to include in exports. Overrides the parent extraFiles config.
   */
  extraFiles?: KnowledgeExtraFile[]

  /**
   * Metadata key-value pairs for exports. Overrides the parent metadata config.
   */
  metadata?: Record<string, string>

  /**
   * Prefix to prepend to each page title. Overrides the parent pageTitlePrefix.
   */
  pageTitlePrefix?: string

  /**
   * Output directory for exported markdown files, relative to public dir.
   *
   * @default 'exports/md'
   */
  staticPath?: string
}

/**
 * Environment-specific knowledge generation configuration. Extends the base
 * integration config with a required output path.
 */
export interface KnowledgeEnvironment extends KnowledgeIntegrationConfig {
  /**
   * Unique identifier for this environment.
   */
  id: string

  /**
   * Output directory for this environment's generated knowledge files.
   */
  outputPath: string
}

/**
 * OpenWebUI integration configuration. References a generation environment
 * and specifies how to load credentials.
 */
export interface OpenWebUiIntegration {
  /**
   * Path to env file containing `OPEN_WEB_UI_*` variables. Defaults to
   * `.env.{id}` by convention.
   */
  envFile?: string

  /**
   * Environment identifier. Must match an `id` in `knowledge.environments`.
   */
  id: string
}

/**
 * Container for platform-specific integration configurations.
 */
export interface KnowledgeIntegrations {
  /**
   * OpenWebUI integration configurations.
   */
  openWebUi?: OpenWebUiIntegration[]
}

export interface KnowledgeConfig {
  /**
   * Generation environments. Each environment inherits global settings but can
   * override them.
   *
   * @inheritDoc
   */
  environments?: KnowledgeEnvironment[]

  /**
   * Shared configuration inherited by all environments.
   *
   * @inheritDoc
   */
  global?: KnowledgeIntegrationConfig

  /**
   * Platform-specific integration configurations for uploading generated
   * knowledge to external services.
   */
  integrations?: KnowledgeIntegrations
}

export interface SearchIndexerOptions {
  /**
   * Disable the file cache. This cache stores the result of parsed MDX files based
   * on each file's md5 checksum. On subsequent edits, values are retrieved from the
   * cache and parsing is avoided for files that have not changed.
   */
  disableCache?: boolean

  /**
   * ToC headings.
   *
   * @default ['h2','h3','h4']
   */
  headings?: TocHeading[]

  /**
   * Optional property for defining nav item hierarchy and page metadata.
   *
   * @inheritDoc
   */
  navConfig?: NavConfig[]

  /**
   * Name of the directory where the MDX pages are located. NOT the full path to the
   * directory.
   */
  pageDirectory: string

  /**
   * Controls how page timestamp metadata is populated from git history.
   *
   * @default "off"
   */
  pageTimestampMetadata?: PageTimestampMetadataMode

  /**
   * Strategy to use for building each route's path segments.  Omit this property if
   * you are using the default {@link https://github.com/kiliman/remix-flat-routes
   * remix-flat-routes} configuration.
   */
  routingStrategy?: RoutingStrategy

  /**
   * Resolved path to the React Router app directory.
   */
  srcDir: string

  /**
   * Resolved QUI TypeDoc props.
   */
  typeDocProps?: Record<string, QuiPropTypes>

  /**
   * Options for TypeDoc property documentation.
   */
  typeDocPropsOptions?: QuiDocsTypeDocOptions
}

export interface QuiDocsConfig
  extends Omit<
    SearchIndexerOptions,
    "srcDir" | "pageDirectory" | "typeDocProps"
  > {
  /**
   * Root app directory. NOT the full path to the directory.
   *
   * @default 'app'
   */
  appDirectory?: string

  /**
   * Matched files will not trigger a rebuild on hot update.
   */
  hotUpdateIgnore?: RegExp

  /**
   * Knowledge generation configuration for LLM integrations.
   *
   * @inheritDoc
   */
  knowledge?: KnowledgeConfig

  /**
   * Name of the directory where the MDX pages are located. NOT the full path to the
   * directory. This is relative to the {@link appDirectory}.
   *
   * @default 'routes'
   */
  pageDirectory?: string

  /**
   * Relative path to the typeDocProps json file. If the `<TypeDocProps />`
   * component is used in an mdx page, the data for its referenced entity will be
   * made available for property documentation rendering.
   *
   * Refer to the {@link https://docs.qui.qualcomm.com/guide/typedoc QUI typedoc guide} to learn more.
   */
  typeDocProps?: string

  /**
   * Options for TypeDoc property documentation.
   */
  typeDocPropsOptions?: QuiDocsTypeDocOptions
}
