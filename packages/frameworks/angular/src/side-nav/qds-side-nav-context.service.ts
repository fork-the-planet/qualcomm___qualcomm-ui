// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {NodeProps} from "@qualcomm-ui/core/tree"
import type {QdsSideNavApi} from "@qualcomm-ui/qds-core/side-nav"
import type {TreeNode} from "@qualcomm-ui/utils/collection"

@Injectable()
export class QdsSideNavContextService extends BaseApiContextService<QdsSideNavApi> {}

export const [
  QDS_SIDE_NAV_CONTEXT,
  useQdsSideNavContext,
  provideQdsSideNavContext,
]: ApiContext<QdsSideNavApi> = createApiContext<QdsSideNavApi>(
  "QdsSideNavContext",
  QdsSideNavContextService,
)

export interface SideNavNodeTemplateContext<T extends TreeNode> {
  $implicit: NodeProps<T>
}
