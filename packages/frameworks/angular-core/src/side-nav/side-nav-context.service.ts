// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {SideNavApi} from "@qualcomm-ui/core/side-nav"

@Injectable()
export class SideNavContextService extends BaseApiContextService<SideNavApi> {}

export const [
  SIDE_NAV_CONTEXT,
  useSideNavContext,
  provideSideNavContext,
]: ApiContext<SideNavApi> = createApiContext<SideNavApi>(
  "SideNavContext",
  SideNavContextService,
)
