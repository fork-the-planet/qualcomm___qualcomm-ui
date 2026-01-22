// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject, input, type OnInit, signal} from "@angular/core"

import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsHeaderBarApi,
  type QdsHeaderBarPadding,
  type QdsHeaderBarRootProps,
  type QdsHeaderBarSize,
  type QdsHeaderSurface,
} from "@qualcomm-ui/qds-core/header-bar"

import {
  provideQdsHeaderBarContext,
  QdsHeaderBarContextService,
} from "./qds-header-bar-context.service"

@Directive({
  providers: [provideQdsHeaderBarContext()],
  selector: "[q-header-bar-root]",
  standalone: false,
})
export class HeaderBarRootDirective
  implements OnInit, SignalifyInput<QdsHeaderBarRootProps>
{
  /**
   * The horizontal padding of the component.
   *
   * @default 'default'
   */
  readonly padding = input<QdsHeaderBarPadding>()

  /**
   * The size of the component and its elements. Governs padding, element spacing,
   * and height.
   *
   * @default 'sm'
   */
  readonly size = input<QdsHeaderBarSize>()

  /**
   * The background color of the component.
   */
  readonly surface = input<QdsHeaderSurface>()

  readonly qdsHeaderBarService = inject(QdsHeaderBarContextService)

  protected readonly api = signal(createQdsHeaderBarApi(normalizeProps))

  protected readonly trackBindings = useTrackBindings(() =>
    this.api().getRootBindings({
      padding: this.padding(),
      size: this.size(),
      surface: this.surface(),
    }),
  )

  ngOnInit() {
    this.qdsHeaderBarService.init(this.api)

    this.trackBindings()
  }
}
