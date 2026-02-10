// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreSwitchHintDirective} from "@qualcomm-ui/angular-core/switch"

import {useQdsSwitchContext} from "./qds-switch-context.service"

/**
 * Hint text displayed below the switch.
 */
@Directive({
  selector: "[q-switch-hint]",
  standalone: false,
})
export class SwitchHintDirective extends CoreSwitchHintDirective {
  protected readonly qdsSwitchContext = useQdsSwitchContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSwitchContext().getHintBindings()),
    )
  }
}
