// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreSideNavHeaderActionDirective} from "@qualcomm-ui/angular-core/side-nav"

import {useQdsSideNavContext} from "./qds-side-nav-context.service"

@Directive({
  selector: "[q-side-nav-header-action]",
  standalone: false,
})
export class SideNavHeaderActionDirective extends CoreSideNavHeaderActionDirective {
  protected qdsContext = useQdsSideNavContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getHeaderActionBindings()),
    )
  }
}
