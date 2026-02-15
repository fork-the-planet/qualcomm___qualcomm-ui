// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ComponentPropsWithRef, type ReactElement, useId} from "react"

import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface StepsProps extends ComponentPropsWithRef<"div"> {}

export function HeadingSteps({...props}: StepsProps): ReactElement {
  const id = useId().replace(":", "")

  const mergedProps = mergeProps(
    {
      className: "qui-docs__steps",
      style: {"--counter-id": props.id ?? id},
    },
    props,
  )

  return <div {...mergedProps}></div>
}
