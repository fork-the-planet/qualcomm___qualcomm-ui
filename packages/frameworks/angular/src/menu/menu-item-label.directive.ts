// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreMenuItemLabelDirective} from "@qualcomm-ui/angular-core/menu"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Directive({
  selector: "[q-menu-item-label]",
  standalone: false,
})
export class MenuItemLabelDirective extends CoreMenuItemLabelDirective {
  protected readonly qdsMenuContext = useQdsMenuContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsMenuContext().getItemLabelBindings()),
    )
  }
}
