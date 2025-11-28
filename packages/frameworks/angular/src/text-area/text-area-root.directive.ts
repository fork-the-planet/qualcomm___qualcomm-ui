// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  CoreTextAreaRootDirective,
  provideTextAreaContext,
} from "@qualcomm-ui/angular-core/text-area"
import {
  createQdsTextAreaApi,
  type QdsTextAreaApiProps,
  type QdsTextAreaSize,
} from "@qualcomm-ui/qds-core/text-area"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  provideQdsTextAreaContext,
  QdsTextAreaContextService,
} from "./qds-text-area-context.service"

/**
 * Groups all parts of the text-area.
 */
@Directive({
  providers: [provideTextAreaContext(), provideQdsTextAreaContext()],
  selector: "[q-text-area-root]",
  standalone: false,
})
export class TextAreaRootDirective
  extends CoreTextAreaRootDirective
  implements SignalifyInput<QdsTextAreaApiProps>, OnInit
{
  /**
   * The size of the textarea and its elements. Governs properties like font size,
   * and item padding.
   *
   * @default 'md'
   */
  readonly size = input<QdsTextAreaSize>()

  protected readonly qdsTextAreaService = inject(QdsTextAreaContextService)

  protected override readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.textAreaService.context().getRootBindings(),
      this.qdsTextAreaService.context().getRootBindings(),
    ),
  )

  override ngOnInit() {
    super.ngOnInit()

    const inputApi = computed(() =>
      createQdsTextAreaApi({size: this.size()}, normalizeProps),
    )

    this.qdsTextAreaService.init(inputApi)
    this.trackBindings()
  }
}
