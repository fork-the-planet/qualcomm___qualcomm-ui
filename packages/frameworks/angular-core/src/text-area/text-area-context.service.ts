// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {TextAreaApi} from "@qualcomm-ui/core/text-area"

@Injectable()
export class TextAreaContextService extends BaseApiContextService<TextAreaApi> {}

export const [
  TEXT_AREA_CONTEXT,
  useTextAreaContext,
  provideTextAreaContext,
]: ApiContext<TextAreaApi> = createApiContext<TextAreaApi>(
  "TextAreaContext",
  TextAreaContextService,
)
