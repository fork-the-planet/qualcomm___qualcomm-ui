// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsAlertBannerApi} from "@qualcomm-ui/qds-core/alert-banner"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export interface AlertBannerContextValue extends QdsAlertBannerApi {
  onClose?: () => void
}

export const [AlertBannerContextProvider, useAlertBannerContext] =
  createGuardedContext<AlertBannerContextValue>({
    hookName: "useAlertBannerContext",
    providerName: "<AlertBannerContextProvider>",
    strict: true,
  })
