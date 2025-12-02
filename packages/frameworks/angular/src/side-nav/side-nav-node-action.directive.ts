// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreTreeNodeActionDirective} from "@qualcomm-ui/angular-core/tree"

import {useQdsSideNavContext} from "./qds-side-nav-context.service"

@Directive({
  selector: "[q-side-nav-node-action]",
  standalone: false,
})
export class SideNavNodeActionDirective extends CoreTreeNodeActionDirective {
  protected qdsContext = useQdsSideNavContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getNodeActionBindings()),
    )
  }
}
