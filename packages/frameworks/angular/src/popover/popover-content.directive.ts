// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CorePopoverContentDirective} from "@qualcomm-ui/angular-core/popover"

import {useQdsPopoverContext} from "./qds-popover-context.service"

@Directive({
  selector: "[q-popover-content]",
  standalone: false,
})
export class PopoverContentDirective extends CorePopoverContentDirective {
  protected readonly qdsContext = useQdsPopoverContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getContentBindings()),
    )
  }
}
