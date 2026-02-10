// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreCheckboxHintDirective} from "@qualcomm-ui/angular-core/checkbox"

import {useQdsCheckboxContext} from "./qds-checkbox-context.service"

/**
 * Hint text displayed below the checkbox.
 */
@Directive({
  selector: "[q-checkbox-hint]",
  standalone: false,
})
export class CheckboxHintDirective extends CoreCheckboxHintDirective {
  protected readonly qdsCheckboxContext = useQdsCheckboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsCheckboxContext().getHintBindings()),
    )
  }
}
