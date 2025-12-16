// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {Link2Icon} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import {clsx} from "@qualcomm-ui/utils/clsx"

import {useJsonViewerStore} from "../../stores"

RefName.displayName = "RefName"

export interface RefNameProps {
  inspect: boolean
  isArray?: boolean
  refName: string
}

export function RefName({inspect, isArray, refName}: RefNameProps): ReactNode {
  const Link = useJsonViewerStore((store) => store.renderLink)
  return (
    <span className="data-ref-name-wrapper">
      <span className={clsx("data-ref-name", {inspect})}>
        {refName}
        {isArray ? "[]" : ""}
      </span>
      <IconButton
        density="compact"
        icon={Link2Icon}
        render={<Link href={`#model-${refName}`} />}
        size="sm"
        variant="ghost"
      />
    </span>
  )
}
