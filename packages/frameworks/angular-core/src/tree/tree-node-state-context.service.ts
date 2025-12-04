// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {NodeState} from "@qualcomm-ui/core/tree"

@Injectable()
export class TreeNodeStateContextService extends BaseApiContextService<NodeState> {}

export const [
  TREE_NODE_STATE_CONTEXT,
  useTreeNodeStateContext,
  provideTreeNodeStateContext,
]: ApiContext<NodeState> = createApiContext<NodeState>(
  "TreeNodeStateContext",
  TreeNodeStateContextService,
)
