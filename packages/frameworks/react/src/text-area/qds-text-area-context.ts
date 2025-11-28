// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsTextAreaApi} from "@qualcomm-ui/qds-core/text-area"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsTextAreaContextProvider, useQdsTextAreaContext] =
  createGuardedContext<QdsTextAreaApi>({
    hookName: "useQdsTextAreaContext",
    providerName: "<QdsTextAreaContextProvider>",
    strict: true,
  })
