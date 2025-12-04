// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {TreeApi} from "@qualcomm-ui/core/tree"
import type {TreeNode} from "@qualcomm-ui/utils/collection"

@Injectable()
export class TreeContextService<
  T extends TreeNode,
> extends BaseApiContextService<TreeApi<T>> {}

export const [
  TREE_CONTEXT,
  useTreeContext,
  provideTreeContext,
]: ApiContext<TreeApi> = createApiContext<TreeApi>(
  "TreeContext",
  TreeContextService,
)
