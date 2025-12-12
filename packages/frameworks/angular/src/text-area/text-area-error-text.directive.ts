// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CoreTextAreaErrorTextDirective} from "@qualcomm-ui/angular-core/text-area"

import {useQdsTextAreaContext} from "./qds-text-area-context.service.js"

/**
 * Error message displayed when the textarea is invalid.
 */
@Directive({
  selector: "[q-text-area-error-text]",
  standalone: false,
})
export class TextAreaErrorTextDirective extends CoreTextAreaErrorTextDirective {
  protected readonly qdsTextAreaContext = useQdsTextAreaContext()

  constructor() {
    super()
    this.trackBindings.extendWith(() =>
      this.qdsTextAreaContext().getErrorTextBindings(),
    )
  }
}
