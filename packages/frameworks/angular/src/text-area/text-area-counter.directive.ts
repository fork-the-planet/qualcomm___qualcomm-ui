// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import {CoreTextAreaCounterDirective} from "@qualcomm-ui/angular-core/text-area"

import {useQdsTextAreaContext} from "./qds-text-area-context.service.js"

function defaultDisplay(count: number, maxLength?: number): string {
  return maxLength != null ? `${count}/${maxLength}` : `${count}`
}

/**
 * Character counter displayed opposite the textarea label. Renders a `<div>`
 * element by default.
 */
@Component({
  selector: "[q-text-area-counter]",
  standalone: false,
  template: "{{ counterText() }}",
})
export class TextAreaCounterDirective extends CoreTextAreaCounterDirective {
  /**
   * Customize how the counter is displayed. Receives the current character
   * count and optional max length, and returns a string.
   */
  readonly display =
    input<(count: number, maxLength?: number) => string>(defaultDisplay)

  readonly counterText = computed(() => {
    const {maxLength, value} = this.textAreaContext()
    return this.display()(value?.length ?? 0, maxLength)
  })

  protected readonly qdsTextAreaContext = useQdsTextAreaContext()

  constructor() {
    super()
    this.trackBindings.extendWith(() =>
      this.qdsTextAreaContext().getCounterBindings(),
    )
  }
}
