// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreTreeLeafNodeDirective} from "@qualcomm-ui/angular-core/tree"

import {useQdsSideNavContext} from "./qds-side-nav-context.service"

@Directive({
  selector: "[q-side-nav-leaf-node]",
  standalone: false,
})
export class SideNavLeafNodeDirective extends CoreTreeLeafNodeDirective {
  protected qdsContext = useQdsSideNavContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getLeafNodeBindings()),
    )
  }
}
