// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {Check, Copy, Download} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"
import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {useSiteContext} from "@qualcomm-ui/react-mdx/context"
import {useCopyToClipboard} from "@qualcomm-ui/react-mdx/copy-to-clipboard"

import {useMdxDocsLayoutContext} from "./use-mdx-docs-layout"

function pathnameToExportId(pathSegments: string[]): string {
  return pathSegments.join("-")
}

export function PageHeader(): ReactNode {
  const {exports, pageMap} = useSiteContext()
  const {pathname} = useMdxDocsLayoutContext()
  const page = pageMap[pathname]
  const exportId = pathnameToExportId(page?.pathSegments || [])
  const hasExport =
    exports?.enabled && exports.pages.find((page) => page.pathname === pathname)
  // example: `/exports/md/guide-markdown.md
  const exportUrl = hasExport ? `${exports.basePath}/${exportId}.md` : null

  async function getExportAsText(): Promise<string> {
    if (!exportUrl) {
      return ""
    }
    return fetch(exportUrl, {method: "GET"})
      .then((response) => response.text())
      .catch((error) => {
        console.error("Error fetching export Markdown:", error)
        return ""
      })
  }

  const {copyToClipboard, isCopied} = useCopyToClipboard({
    valueOrFn: getExportAsText,
  })

  if (!page) {
    return null
  }

  const {title} = page

  return (
    <header className="qui-docs__page-header">
      <div className="qui-docs__page-header-title-row">
        <h1 className="mdx qui-docs__page-title">{title}</h1>
        {exportUrl && (
          <div className="qui-docs__page-header-actions">
            <Button
              className="qui-docs__page-header-copy-button"
              endIcon={isCopied ? Check : Copy}
              onClick={copyToClipboard}
              size="sm"
              variant="outline"
            >
              Copy Page
            </Button>
            <Menu.Root size="sm">
              <Menu.Trigger>
                <Menu.IconButton
                  className="qui-docs__page-header-menu-button"
                  size="sm"
                  variant="outline"
                />
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item onClick={copyToClipboard} value="copy-page">
                      <Menu.ItemStartIcon icon={Copy} />
                      <Menu.ItemLabel>Copy Page</Menu.ItemLabel>
                      <Menu.ItemDescription>
                        Copy page as markdown for LLMs
                      </Menu.ItemDescription>
                    </Menu.Item>
                    <Menu.Item
                      render={<a download href={exportUrl} />}
                      value="download-page"
                    >
                      <Menu.ItemStartIcon icon={Download} />
                      <Menu.ItemLabel>Download Page</Menu.ItemLabel>
                      <Menu.ItemDescription>
                        Download page as markdown
                      </Menu.ItemDescription>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </div>
        )}
      </div>
    </header>
  )
}
