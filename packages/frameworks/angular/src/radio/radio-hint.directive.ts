// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreRadioItemHintDirective} from "@qualcomm-ui/angular-core/radio"

import {useQdsRadioContext} from "./qds-radio-context.service"

/**
 * Hint text displayed below the radio.
 */
@Directive({
  selector: "[q-radio-hint]",
  standalone: false,
})
export class RadioHintDirective extends CoreRadioItemHintDirective {
  protected readonly qdsRadioContext = useQdsRadioContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsRadioContext().getItemHintBindings()),
    )
  }
}
