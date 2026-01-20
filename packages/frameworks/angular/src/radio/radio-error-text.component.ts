// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"
import {CircleAlert} from "lucide-angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CoreRadioItemErrorTextDirective} from "@qualcomm-ui/angular-core/radio"

import {useQdsRadioContext} from "./qds-radio-context.service"

/**
 * Error message displayed when the radio is invalid.
 */
@Component({
  selector: "[q-radio-error-text]",
  standalone: false,
  template: `
    <svg [qIcon]="icon()!" />
    <ng-content />
  `,
})
export class RadioErrorTextComponent extends CoreRadioItemErrorTextDirective {
  /**
   * Error indicator icon.
   *
   * @default CircleAlert
   */
  readonly icon = input<LucideIconOrString>(CircleAlert)

  protected readonly qdsRadioContext = useQdsRadioContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsRadioContext().getItemErrorTextBindings()),
    )
  }
}
