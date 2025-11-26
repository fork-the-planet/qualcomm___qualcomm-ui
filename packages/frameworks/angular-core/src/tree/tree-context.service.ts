import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {TreeApi} from "@qualcomm-ui/core/tree"

@Injectable()
export class TreeContextService extends BaseApiContextService<TreeApi> {}

export const [
  TREE_CONTEXT,
  useTreeContext,
  provideTreeContext,
]: ApiContext<TreeApi> = createApiContext<TreeApi>(
  "TreeContext",
  TreeContextService,
)
