// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreRadioGroupHintDirective} from "@qualcomm-ui/angular-core/radio"

import {useQdsRadioContext} from "../qds-radio-context.service"

/**
 * Hint text displayed below the radio group.
 */
@Directive({
  selector: "[q-radio-group-hint]",
  standalone: false,
})
export class RadioGroupHintDirective extends CoreRadioGroupHintDirective {
  protected readonly qdsRadioContext = useQdsRadioContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsRadioContext().getGroupHintBindings()),
    )
  }
}
