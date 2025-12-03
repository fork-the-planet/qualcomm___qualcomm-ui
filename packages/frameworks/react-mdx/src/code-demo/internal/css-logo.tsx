// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

export function CssLogo(props: ComponentPropsWithRef<"svg">): ReactElement {
  return (
    <svg
      viewBox="0 0 256 256"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m26.9 10 18.4 212.4 82.6 23.6 82.8-23.6L229.1 10H26.9zM180 186.4l-52 14.8-51.9-14.9-3.5-40.9H98l1.8 20.9 28.2 8 .1.1 28.2-7.8 2.9-33.8H100l-2-26.4h63.6l2.3-26.9h-97l-2.1-25.8h126.7L180 186.4z"
        fill="currentColor"
      />
    </svg>
  )
}
