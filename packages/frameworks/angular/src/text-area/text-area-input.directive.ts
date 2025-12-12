// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {useForbiddenFormControlWarning} from "@qualcomm-ui/angular-core/forms"
import {CoreTextAreaInputDirective} from "@qualcomm-ui/angular-core/text-area"

import {useQdsTextAreaContext} from "./qds-text-area-context.service"

/**
 * The text area element. Note: do not apply form control bindings like `ngModel`
 * or `formControl` to this element. Apply them to the root element instead.
 */
@Directive({
  selector: "[q-text-area-input]",
  standalone: false,
})
export class TextAreaInputDirective extends CoreTextAreaInputDirective {
  protected readonly qdsTextAreaContext = useQdsTextAreaContext()

  constructor() {
    super()
    useForbiddenFormControlWarning({
      directive: "q-text-area-input",
      rootDirective: "q-text-area",
    })
    this.trackBindings.extendWith(() =>
      this.qdsTextAreaContext().getInputBindings(),
    )
  }
}
