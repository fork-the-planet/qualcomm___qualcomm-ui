// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {z, type ZodObject, type ZodSchema} from "zod"

import type {
  KnowledgeConfig,
  KnowledgeEnvironment,
  KnowledgeExportsConfig,
  KnowledgeExtraFile,
  KnowledgeIntegrationConfig,
  KnowledgeIntegrations,
  NavMeta,
  OpenWebUiIntegration,
  QuiDocsConfig,
  QuiDocsTypeDocOptions,
  RouteMeta,
} from "../types"

import {implement} from "./zod"

export const navMetaSchema: ZodObject<{}> = implement<NavMeta>().with({
  id: z.never().optional(),
  sectionTitle: z.string().optional(),
  separator: z.boolean().optional(),
})

export const routeMetaSchema: ZodSchema<RouteMeta> =
  implement<RouteMeta>().with({
    children: z.array(z.lazy(() => routeMetaSchema)).optional(),
    expanded: z.boolean().optional(),
    group: z.string().optional(),
    groupOrder: z.string().array().optional(),
    hidden: z.boolean().optional(),
    hideBreadcrumbs: z.boolean().optional(),
    hideFromSearch: z.boolean().optional(),
    hidePageLinks: z.boolean().optional(),
    hideSideNav: z.boolean().optional(),
    hideToc: z.boolean().optional(),
    id: z.string(),
    ignoreRouteMetaOrder: z.boolean().optional(),
    restricted: z.boolean().optional(),
    sectionTitle: z.never().optional(),
    separator: z.never().optional(),
    sideNavTitle: z.string().optional(),
    title: z.string().optional(),
  })

const typeDocPropsSchema = implement<QuiDocsTypeDocOptions>().with({
  includeInSearchIndex: z.boolean().optional(),
})

const knowledgeExtraFileSchema = implement<KnowledgeExtraFile>().with({
  contents: z.string(),
  id: z.string(),
  processAsMdx: z.boolean().optional(),
  title: z.string().optional(),
})

const knowledgeExportsSchema = implement<KnowledgeExportsConfig>().with({
  enabled: z.boolean().optional(),
  exclude: z.array(z.string()).optional(),
  extraFiles: z.array(knowledgeExtraFileSchema).optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  pageTitlePrefix: z.string().optional(),
  staticPath: z.string().optional(),
})

const knowledgeIntegrationSchema = implement<KnowledgeIntegrationConfig>().with(
  {
    baseUrl: z.string().optional(),
    description: z.string().optional(),
    exclude: z.array(z.string()).optional(),
    exports: knowledgeExportsSchema.optional(),
    extraFiles: z.array(knowledgeExtraFileSchema).optional(),
    frontmatterFields: z.array(z.string()).optional(),
    metadata: z.record(z.string(), z.string()).optional(),
    name: z.string().optional(),
    outputMode: z
      .union([z.literal("per-page"), z.literal("aggregated")])
      .optional(),
    outputPath: z.string().optional(),
    pageIdPrefix: z.string().optional(),
    pageTitlePrefix: z.string().optional(),
  },
)

const knowledgeEnvironmentSchema = implement<KnowledgeEnvironment>().with({
  baseUrl: z.string().optional(),
  description: z.string().optional(),
  exclude: z.array(z.string()).optional(),
  exports: knowledgeExportsSchema.optional(),
  extraFiles: z.array(knowledgeExtraFileSchema).optional(),
  frontmatterFields: z.array(z.string()).optional(),
  id: z.string(),
  metadata: z.record(z.string(), z.string()).optional(),
  name: z.string().optional(),
  outputMode: z
    .union([z.literal("per-page"), z.literal("aggregated")])
    .optional(),
  outputPath: z.string(),
  pageIdPrefix: z.string().optional(),
  pageTitlePrefix: z.string().optional(),
})

const openWebUiIntegrationSchema = implement<OpenWebUiIntegration>().with({
  envFile: z.string().optional(),
  id: z.string(),
})

const knowledgeIntegrationsSchema = implement<KnowledgeIntegrations>().with({
  openWebUi: z.array(openWebUiIntegrationSchema).optional(),
})

const knowledgeConfigSchema = implement<KnowledgeConfig>().with({
  environments: z.array(knowledgeEnvironmentSchema).optional(),
  global: knowledgeIntegrationSchema.optional(),
  integrations: knowledgeIntegrationsSchema.optional(),
})

export const configSchema = implement<QuiDocsConfig>().with({
  appDirectory: z.string().optional(),
  disableCache: z.boolean().optional(),
  headings: z
    .array(
      z.union([
        z.literal("h1"),
        z.literal("h2"),
        z.literal("h3"),
        z.literal("h4"),
        z.literal("h5"),
        z.literal("h6"),
      ]),
    )
    .optional(),
  hotUpdateIgnore: z.instanceof(RegExp).optional(),
  knowledge: knowledgeConfigSchema.optional(),
  navConfig: z.array(z.union([routeMetaSchema, navMetaSchema])).optional(),
  pageDirectory: z.string().optional(),
  pageTimestampMetadata: z
    .union([
      z.literal("off"),
      z.literal("timestamp"),
      z.literal("user-and-timestamp"),
    ])
    .optional(),
  routingStrategy: z.union([z.literal("vite-generouted"), z.any()]).optional(),
  typeDocProps: z.string().optional(),
  typeDocPropsOptions: typeDocPropsSchema.optional(),
})
