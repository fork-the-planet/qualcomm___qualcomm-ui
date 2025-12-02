// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {TreeApi} from "@qualcomm-ui/core/tree"
import {renderProp, type RenderProp} from "@qualcomm-ui/react-core/system"
import {useTreeContext} from "@qualcomm-ui/react-core/tree"
import type {TreeNode} from "@qualcomm-ui/utils/collection"

export interface TreeContextProps<T extends TreeNode> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: RenderProp<TreeApi<T>>
}

export function TreeContext<T extends TreeNode>({
  children,
}: TreeContextProps<T>): ReactNode {
  const treeContext = useTreeContext<T>()
  return renderProp(children, treeContext)
}
