// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsTextAreaApi} from "@qualcomm-ui/qds-core/text-area"

@Injectable()
export class QdsTextAreaContextService extends BaseApiContextService<QdsTextAreaApi> {}

export const [
  QDS_TEXT_AREA_CONTEXT,
  useQdsTextAreaContext,
  provideQdsTextAreaContext,
]: ApiContext<QdsTextAreaApi> = createApiContext<QdsTextAreaApi>(
  "QdsTextAreaContext",
  QdsTextAreaContextService,
)
