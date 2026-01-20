// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"

import {provideRadioItemContext} from "@qualcomm-ui/angular-core/radio"

import {provideQdsRadioContext} from "./qds-radio-context.service"
import {RadioRootDirective} from "./radio-root.directive"

@Component({
  providers: [provideRadioItemContext(), provideQdsRadioContext()],
  selector: "[q-radio]",
  standalone: false,
  template: `
    <ng-content select="[q-radio-hidden-input]">
      <input q-radio-hidden-input />
    </ng-content>
    <ng-content select="[q-radio-control]">
      <div q-radio-control></div>
    </ng-content>
    <ng-content select="[q-radio-label]">
      @if (label()) {
        <span q-radio-label>
          {{ label() }}
        </span>
      }
    </ng-content>
    <ng-content select="[q-radio-error-text]">
      @if (errorText()) {
        <div q-radio-error-text>
          {{ errorText() }}
        </div>
      }
    </ng-content>
    <ng-content select="[q-radio-hint]">
      @if (hint()) {
        <div q-radio-hint>
          {{ hint() }}
        </div>
      }
    </ng-content>
  `,
})
export class RadioComponent extends RadioRootDirective {
  /**
   * Optional error that describes the radio when the field is invalid. This
   * element is automatically associated with the radio for accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <label q-radio>
   *   <div q-radio-error-text>...</div>
   * </label>
   * ```
   */
  readonly errorText = input<string>()

  /**
   * Optional hint text displayed below the radio. Hints are hidden when the
   * radio is invalid.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <label q-radio>
   *   <div q-radio-hint>...</div>
   * </label>
   * ```
   */
  readonly hint = input<string>()

  /**
   * Optional label describing the element. Recommended. This element is
   * automatically associated with the component's input element for accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <label q-radio>
   *   <div q-radio-label>...</div>
   * </label>
   * ```
   */
  readonly label = input<string | undefined>()
}
