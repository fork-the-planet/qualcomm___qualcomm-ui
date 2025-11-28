// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TextAreaApi} from "@qualcomm-ui/core/text-area"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [TextAreaContextProvider, useTextAreaContext] =
  createGuardedContext<TextAreaApi>({
    hookName: "useTextAreaContext",
    providerName: "<TextAreaContextProvider>",
    strict: true,
  })
