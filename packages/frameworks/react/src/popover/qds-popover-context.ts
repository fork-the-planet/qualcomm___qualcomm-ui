// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsPopoverApi} from "@qualcomm-ui/qds-core/popover"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsPopoverContextProvider, useQdsPopoverContext] =
  createGuardedContext<QdsPopoverApi>({
    hookName: "useQdsPopoverContext",
    providerName: "<QdsPopoverContextProvider>",
    strict: true,
  })
