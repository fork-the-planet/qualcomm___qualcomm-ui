// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactNode} from "react"

import {useSiteContext} from "@qualcomm-ui/react-mdx/context"
import {clsx} from "@qualcomm-ui/utils/clsx"

import {useMdxDocsLayoutContext} from "../layout"

interface MdxH1Props extends ComponentPropsWithRef<"h1"> {
  "data-page-title"?: ""
}

export function MdxH1({
  children,
  className,
  "data-page-title": dataPageTitle,
  id,
  ...props
}: MdxH1Props): ReactNode {
  const {pageMap} = useSiteContext()
  const {pathname} = useMdxDocsLayoutContext()
  const page = pageMap[pathname]

  if (dataPageTitle === "") {
    return null
  }

  const childText = getChildrenText(children)
  if (page?.title === childText) {
    return null
  }

  return (
    <h1 className={clsx(className, "mdx")} id={id || undefined} {...props}>
      {children}
    </h1>
  )
}

function getChildrenText(children: ReactNode): string {
  if (typeof children === "string") {
    return children
  }
  if (typeof children === "number") {
    return String(children)
  }
  if (Array.isArray(children)) {
    return children.map(getChildrenText).join("")
  }
  if (children && typeof children === "object" && "props" in children) {
    return getChildrenText(
      (children as {props: {children?: ReactNode}}).props.children,
    )
  }
  return ""
}
