// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CoreTextAreaHintDirective} from "@qualcomm-ui/angular-core/text-area"

import {useQdsTextAreaContext} from "./qds-text-area-context.service.js"

/**
 * Helper text displayed below the textarea.
 */
@Directive({
  selector: "[q-text-area-hint]",
  standalone: false,
})
export class TextAreaHintDirective extends CoreTextAreaHintDirective {
  protected readonly qdsTextAreaContext = useQdsTextAreaContext()

  constructor() {
    super()
    this.trackBindings.extendWith(() =>
      this.qdsTextAreaContext().getHintBindings(),
    )
  }
}
