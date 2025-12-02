// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreTreeBranchContentDirective} from "@qualcomm-ui/angular-core/tree"

import {useQdsSideNavContext} from "./qds-side-nav-context.service"

@Directive({
  selector: "[q-side-nav-branch-content]",
  standalone: false,
})
export class SideNavBranchContentDirective extends CoreTreeBranchContentDirective {
  protected qdsContext = useQdsSideNavContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getBranchContentBindings()),
    )
  }
}
