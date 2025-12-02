// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreTreeNodeIndicatorDirective} from "@qualcomm-ui/angular-core/tree"

import {useQdsSideNavContext} from "./qds-side-nav-context.service"

@Directive({
  selector: "[q-side-nav-node-indicator]",
  standalone: false,
})
export class SideNavNodeIndicatorDirective extends CoreTreeNodeIndicatorDirective {
  protected qdsContext = useQdsSideNavContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getNodeIndicatorBindings()),
    )
  }
}
