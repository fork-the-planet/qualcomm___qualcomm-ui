// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, inject, input} from "@angular/core"

import {
  ButtonDirective,
  provideQdsButtonContext,
} from "@qualcomm-ui/angular/button"
import {
  END_ICON_CONTEXT_TOKEN,
  type IconTokenContext,
  START_ICON_CONTEXT_TOKEN,
} from "@qualcomm-ui/angular/icon"
import type {
  QdsButtonDensity,
  QdsButtonSize,
  QdsButtonVariant,
} from "@qualcomm-ui/qds-core/button"

@Component({
  providers: [
    provideQdsButtonContext(),
    {
      provide: START_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const button = inject(HeaderBarActionButtonDirective)
        return {
          getBindings: computed(() =>
            button.buttonService.context().getStartIconBindings(),
          ),
        }
      },
    },
    {
      provide: END_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const button = inject(HeaderBarActionButtonDirective)
        return {
          getBindings: computed(() =>
            button.buttonService.context().getEndIconBindings(),
          ),
        }
      },
    },
  ],
  selector: "[q-header-bar-action-button]",
  standalone: false,
  template: `
    <ng-content select="[q-start-icon]">
      @if (startIcon()) {
        <svg q-start-icon [icon]="startIcon()!"></svg>
      }
    </ng-content>

    <ng-content />

    <ng-content select="[q-end-icon]">
      @if (endIcon()) {
        <svg q-end-icon [icon]="endIcon()!"></svg>
      }
    </ng-content>
  `,
})
export class HeaderBarActionButtonDirective extends ButtonDirective {
  override readonly density = input<QdsButtonDensity | undefined>("compact")
  override readonly size = input<QdsButtonSize | undefined>("lg")
  override readonly variant = input<QdsButtonVariant | undefined>("ghost")
}
