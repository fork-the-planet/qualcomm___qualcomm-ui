import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {NodeProps} from "@qualcomm-ui/core/tree"

@Injectable()
export class TreeNodePropsContextService extends BaseApiContextService<NodeProps> {}

export const [
  TREE_NODE_PROPS_CONTEXT,
  useTreeNodePropsContext,
  provideTreeNodePropsContext,
]: ApiContext<NodeProps> = createApiContext<NodeProps>(
  "TreeNodePropsContext",
  TreeNodePropsContextService,
)
