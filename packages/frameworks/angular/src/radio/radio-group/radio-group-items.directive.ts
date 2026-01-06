// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, computed, Directive, input} from "@angular/core"

import {CoreRadioGroupItemsDirective} from "@qualcomm-ui/angular-core/radio"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {useQdsRadioContext} from "../qds-radio-context.service"

@Directive({
  selector: "[q-radio-group-items]",
  standalone: false,
})
export class RadioGroupItemsDirective extends CoreRadioGroupItemsDirective {
  /**
   * Indents the radio items.
   * @default false
   */
  readonly indented = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  protected readonly qdsRadioContext = useQdsRadioContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsRadioContext().getGroupItemsBindings()),
    )
  }
}
