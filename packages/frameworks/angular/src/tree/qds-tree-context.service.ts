import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {NodeProps} from "@qualcomm-ui/core/tree"
import type {QdsTreeApi} from "@qualcomm-ui/qds-core/tree"
import type {TreeNode} from "@qualcomm-ui/utils/collection"

@Injectable()
export class QdsTreeContextService extends BaseApiContextService<QdsTreeApi> {}

export const [
  QDS_TREE_CONTEXT,
  useQdsTreeContext,
  provideQdsTreeContext,
]: ApiContext<QdsTreeApi> = createApiContext<QdsTreeApi>(
  "QdsTreeContext",
  QdsTreeContextService,
)

export interface TreeNodeTemplateContext<T extends TreeNode> {
  $implicit: NodeProps<T>
}
