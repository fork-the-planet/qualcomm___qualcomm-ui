// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsAlertBannerApi} from "@qualcomm-ui/qds-core/alert-banner"

export interface QdsAlertBannerContextValue extends QdsAlertBannerApi {
  onClose?: () => void
}

@Injectable()
export class QdsAlertBannerContextService extends BaseApiContextService<QdsAlertBannerContextValue> {}

export const [
  QDS_ALERT_BANNER_CONTEXT,
  useQdsAlertBannerContext,
  provideQdsAlertBannerContext,
]: ApiContext<QdsAlertBannerContextValue> =
  createApiContext<QdsAlertBannerContextValue>(
    "QdsAlertBannerContext",
    QdsAlertBannerContextService,
  )
