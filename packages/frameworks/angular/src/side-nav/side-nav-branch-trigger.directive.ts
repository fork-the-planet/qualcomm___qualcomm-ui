// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreTreeBranchTriggerDirective} from "@qualcomm-ui/angular-core/tree"

import {useQdsSideNavContext} from "./qds-side-nav-context.service"

@Directive({
  selector: "[q-side-nav-branch-trigger]",
  standalone: false,
})
export class SideNavBranchTriggerDirective extends CoreTreeBranchTriggerDirective {
  protected qdsContext = useQdsSideNavContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getBranchTriggerBindings()),
    )
  }
}
