import {readFileSync} from "node:fs"
import {resolve} from "node:path"

import type {NavConfig, QuiDocsConfig} from "@qualcomm-ui/mdx-vite"

const navConfig: NavConfig[] = [
  {
    id: "_index",
  },
  {
    id: "installation",
  },
  {
    children: [
      {
        id: "overview",
      },
      {
        id: "column-definitions",
      },
      {
        id: "data",
      },
      {
        id: "table-state",
      },
      {
        id: "row-models",
      },
      {
        id: "rows",
      },
      {
        id: "cells",
      },
      {
        id: "header-groups",
      },
      {
        id: "headers",
      },
      {
        id: "columns",
      },
      {
        id: "table-rendering",
      },
    ],
    expanded: true,
    id: "guides",
    title: "Guides",
  },
  {
    expanded: false,
    id: "feature-guides",
    title: "Feature Guides",
  },
  {
    expanded: true,
    id: "features",
    title: "Feature Examples",
  },
  {
    children: [
      {
        children: [{id: "core"}],
        id: "features",
      },
    ],
    expanded: true,
    id: "api",
    title: "API",
  },
  {
    expanded: true,
    id: "components",
    title: "Components",
  },
]

export default {
  appDirectory: "src",
  /*
   * Angular demos are built and copied to the public directory. The
   * angularDemoPlugin handles hot reloading when this happens, so we ignore the
   * dist directory to prevent the docsPlugin from reloading in response to the same
   * changes.
   */
  hotUpdateIgnore: /angular-demo-module|public/,
  knowledge: {
    global: {
      baseUrl: "https://angular-table-next.qui.qualcomm.com",
      exclude: ["installation.mdx", "index/_index.mdx"],
      exports: {
        enabled: true,
        exclude: [],
      },
      extraFiles: [
        {
          contents: readFileSync(
            resolve(__dirname, "../../frameworks/angular/CHANGELOG.md"),
            "utf-8",
          ),
          id: "angular-changelog",
        },
        {
          contents: readFileSync(
            resolve(__dirname, "../../common/core/CHANGELOG.md"),
            "utf-8",
          ),
          id: "core-changelog",
        },
      ],
      metadata: {
        category: "core-components",
        framework: "angular",
      },
    },
  },
  navConfig,
  pageDirectory: "routes",
  pageTimestampMetadata: "user-and-timestamp",
  typeDocProps: ".typedoc/doc-props.json",
} satisfies QuiDocsConfig
