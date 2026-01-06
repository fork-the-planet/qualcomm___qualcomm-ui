// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CoreRadioGroupDirective,
  provideRadioContext,
} from "@qualcomm-ui/angular-core/radio"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsRadioApi,
  type QdsRadioApiProps,
  type QdsRadioSize,
} from "@qualcomm-ui/qds-core/radio"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {
  provideQdsRadioContext,
  QdsRadioContextService,
} from "../qds-radio-context.service"

@Directive({
  providers: [provideRadioContext(), provideQdsRadioContext()],
  selector: "[q-radio-group]",
  standalone: false,
})
export class RadioGroupDirective
  extends CoreRadioGroupDirective
  implements SignalifyInput<QdsRadioApiProps>
{
  /**
   * Indents the radio items.
   * @default false
   */
  readonly indented = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The size of the radio and its elements. Governs properties like label font
   * size, control size, and indicator size.
   * @default 'md'
   */
  readonly size = input<QdsRadioSize | undefined>()

  readonly qdsRadioService = inject(QdsRadioContextService)

  override ngOnInit() {
    super.ngOnInit()

    this.qdsRadioService.init(
      computed(() =>
        createQdsRadioApi(
          {indented: this.indented(), size: this.size()},
          normalizeProps,
        ),
      ),
    )

    this.trackBindings.extendWith(
      computed(() => this.qdsRadioService.context().getGroupBindings()),
    )
  }
}
