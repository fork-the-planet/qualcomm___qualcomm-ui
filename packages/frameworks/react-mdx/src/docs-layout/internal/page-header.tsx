// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PageHeaderProps extends ComponentPropsWithRef<"h1"> {}

export function PageHeader(props: PageHeaderProps): ReactElement {
  return <h1 {...mergeProps({className: "mdx"}, props)} />
}
