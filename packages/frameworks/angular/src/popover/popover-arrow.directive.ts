// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {CorePopoverArrowDirective} from "@qualcomm-ui/angular-core/popover"

import {useQdsPopoverContext} from "./qds-popover-context.service"

@Component({
  selector: "[q-popover-arrow]",
  standalone: false,
  template: `
    <ng-content>
      <div q-popover-arrow-tip></div>
    </ng-content>
  `,
})
export class PopoverArrowDirective extends CorePopoverArrowDirective {
  protected readonly qdsContext = useQdsPopoverContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getArrowBindings()),
    )
  }
}
