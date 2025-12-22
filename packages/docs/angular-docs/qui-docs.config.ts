import {readFileSync} from "node:fs"
import {resolve} from "node:path"

import type {NavConfig, QuiDocsConfig} from "@qualcomm-ui/mdx-vite"

const navConfig: NavConfig[] = [
  {sectionTitle: "Getting Started"},
  {
    hidden: true,
    id: "_index",
  },
  {
    id: "installation",
  },
  {
    id: "integrations",
    title: "Integrations & Configs",
  },
  {
    separator: true,
  },
  {sectionTitle: "Theming, Patterns, and Pitfalls"},
  {
    children: [
      {
        id: "overview",
      },
    ],
    id: "theming",
  },
  {
    id: "patterns",
    title: "Patterns",
  },
  {
    id: "pitfalls",
  },
  {
    separator: true,
  },
  {
    children: [
      {
        group: "Data Display",
        id: "badges",
        ignoreRouteMetaOrder: true,
      },
    ],
    expanded: true,
    groupOrder: [
      "Buttons",
      "Form Controls",
      "Data Display",
      "Overlays",
      "Disclosure",
      "Feedback",
    ],
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
      baseUrl: "https://angular-next.qui.qualcomm.com",
      exclude: ["index.mdx", "**/components+/overview*"],
      exports: {
        enabled: true,
        exclude: ["**/components+/overview*"],
      },
      extraFiles: [
        {
          contents: readFileSync(
            resolve(__dirname, "../../frameworks/angular/CHANGELOG.md"),
            "utf-8",
          )
            .split("\n")
            .slice(2)
            .join("\n"),
          id: "angular-changelog",
          title: "Changelog",
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
