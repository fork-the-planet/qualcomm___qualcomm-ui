// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CorePopoverRootDirective,
  providePopoverContext,
} from "@qualcomm-ui/angular-core/popover"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsPopoverApi,
  type QdsPopoverApiProps,
  type QdsPopoverEmphasis,
} from "@qualcomm-ui/qds-core/popover"

import {
  provideQdsPopoverContext,
  QdsPopoverContextService,
} from "./qds-popover-context.service"

@Directive({
  providers: [providePopoverContext(), provideQdsPopoverContext()],
  selector: "[q-popover-root]",
  standalone: false,
})
export class PopoverRootDirective
  extends CorePopoverRootDirective
  implements SignalifyInput<QdsPopoverApiProps>, OnInit
{
  /**
   * The style variant of the popover.
   *
   * @option `'neutral'`: neutral overlay background with dark text.
   * @option `'brand'`: brand primary background with white text.
   *
   * @default 'neutral'
   */
  readonly emphasis = input<QdsPopoverEmphasis>()

  protected readonly qdsPopoverService = inject(QdsPopoverContextService)

  override ngOnInit() {
    super.ngOnInit()

    this.qdsPopoverService.init(
      computed(() =>
        createQdsPopoverApi(
          {
            emphasis: this.emphasis(),
          },
          normalizeProps,
        ),
      ),
    )
  }
}
