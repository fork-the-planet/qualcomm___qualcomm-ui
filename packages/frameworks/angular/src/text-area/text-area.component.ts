// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"

import {provideTextAreaContext} from "@qualcomm-ui/angular-core/text-area"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {provideQdsTextAreaContext} from "./qds-text-area-context.service"
import {TextAreaRootDirective} from "./text-area-root.directive"

@Component({
  providers: [provideTextAreaContext(), provideQdsTextAreaContext()],
  selector: "q-text-area:not([q-text-area-root])",
  standalone: false,
  template: `
    <ng-content select="[q-text-area-label]">
      @if (label()) {
        <label q-text-area-label>{{ label() }}</label>
      }
    </ng-content>

    <ng-content select="[q-text-area-counter]">
      @if (counter() ?? maxLength() !== undefined) {
        <div q-text-area-counter></div>
      }
    </ng-content>

    <textarea
      q-text-area-input
      [maxLength]="maxLength()"
      [placeholder]="placeholder()"
    ></textarea>

    <ng-content select="[q-text-area-hint]">
      @if (hint()) {
        <span q-text-area-hint>
          {{ hint() }}
        </span>
      }
    </ng-content>

    <ng-content select="[q-text-area-error-text]">
      @if (errorText()) {
        <div q-text-area-error-text>
          {{ errorText() }}
        </div>
      }
    </ng-content>
  `,
})
export class TextAreaComponent extends TextAreaRootDirective {
  /**
   * Controls whether to display the counter element.
   *
   * - `true`: always show the counter
   * - `false`: never show the counter
   * - `undefined` (default): only show the counter if `maxLength` is set
   */
  readonly counter = input<boolean | undefined, Booleanish>(undefined, {
    transform: (value) =>
      value === undefined
        ? undefined
        : typeof value === "boolean"
          ? value
          : value !== "false",
  })

  /**
   * Optional error that describes the element when {@link invalid} is true.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-text-area-error-text>...</div>
   * ```
   */
  readonly errorText = input<string | undefined | null>()

  /**
   * Optional hint describing the element. This element is automatically
   * associated with the component's input element for accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-text-area-hint>...</div>
   * ```
   */
  readonly hint = input<string | undefined | null>()

  /**
   * Optional label describing the element. Recommended. This element is
   * automatically associated with the component's input element for
   * accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <label q-text-area-label>...</label>
   * ```
   */
  readonly label = input<string | undefined>()

  /**
   * HTML {@link https://www.w3schools.com/tags/att_input_placeholder.asp placeholder} attribute,
   * passed to the internal input element.
   */
  readonly placeholder = input<string>("")
}
