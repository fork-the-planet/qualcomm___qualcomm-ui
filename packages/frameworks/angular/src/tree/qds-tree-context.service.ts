import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsTreeApi} from "@qualcomm-ui/qds-core/tree"

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
