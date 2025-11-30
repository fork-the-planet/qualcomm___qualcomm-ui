// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsHeaderBarApi} from "@qualcomm-ui/qds-core/header-bar"

@Injectable()
export class QdsHeaderBarContextService extends BaseApiContextService<QdsHeaderBarApi> {}

export const [
  QDS_HEADER_BAR_CONTEXT,
  useQdsHeaderBarContext,
  provideQdsHeaderBarContext,
]: ApiContext<QdsHeaderBarApi> = createApiContext<QdsHeaderBarApi>(
  "QdsHeaderBarContext",
  QdsHeaderBarContextService,
)
