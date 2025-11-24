// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"

import {
  IconButtonDirective,
  provideQdsIconButtonContext,
} from "@qualcomm-ui/angular/button"
import type {
  QdsButtonDensity,
  QdsButtonSize,
  QdsButtonVariant,
} from "@qualcomm-ui/qds-core/button"

@Component({
  providers: [provideQdsIconButtonContext()],
  selector: "[q-header-bar-action-icon-button]",
  standalone: false,
  template: `
    <ng-content select="svg[qIcon]" />
    @if (icon()) {
      <svg [q-bind]="iconProps()" [qIcon]="icon()!"></svg>
    }
  `,
})
export class HeaderBarActionIconButtonDirective extends IconButtonDirective {
  override readonly density = input<QdsButtonDensity | undefined>("compact")
  override readonly size = input<QdsButtonSize | undefined>("lg")
  override readonly variant = input<QdsButtonVariant | undefined>("ghost")
}
