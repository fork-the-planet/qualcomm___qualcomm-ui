// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsPopoverApi} from "@qualcomm-ui/qds-core/popover"

@Injectable()
export class QdsPopoverContextService extends BaseApiContextService<QdsPopoverApi> {}

export const [
  QDS_POPOVER_CONTEXT,
  useQdsPopoverContext,
  provideQdsPopoverContext,
]: ApiContext<QdsPopoverApi> = createApiContext<QdsPopoverApi>(
  "QdsPopoverContext",
  QdsPopoverContextService,
)
