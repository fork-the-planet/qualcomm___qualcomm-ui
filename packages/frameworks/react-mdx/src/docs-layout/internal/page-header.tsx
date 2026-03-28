// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"
import {Tooltip} from "@qualcomm-ui/react/tooltip"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useMdxDocsLayoutContext} from "../layout"

export interface PageHeaderProps extends ComponentPropsWithRef<"h1"> {}

export function PageHeader(props: PageHeaderProps): ReactElement {
  const context = useMdxDocsLayoutContext()
  const frontmatter = context.pageFrontmatter
  const since =
    frontmatter.since && typeof frontmatter.since === "string"
      ? frontmatter.since
      : undefined

  return (
    <div className="qui-docs__page-header">
      <h1 {...mergeProps({className: "mdx"}, props)} />
      {since ? (
        <Tooltip
          trigger={
            <span>
              <Badge
                className="qui-docs__page-header-since-badge"
                emphasis="info"
                size="sm"
              >
                {since}
              </Badge>
            </span>
          }
        >
          This module was added in version {since}
        </Tooltip>
      ) : null}
    </div>
  )
}
