// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  computed,
  Directive,
  inject,
  input,
  type OnInit,
  output,
} from "@angular/core"

import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsAlertBannerApi,
  type QdsAlertBannerApiProps,
  type QdsAlertBannerEmphasis,
  type QdsAlertBannerVariant,
} from "@qualcomm-ui/qds-core/alert-banner"
import type {Direction} from "@qualcomm-ui/utils/direction"

import {
  provideQdsAlertBannerContext,
  QdsAlertBannerContextService,
  type QdsAlertBannerContextValue,
} from "./qds-alert-banner-context.service"

@Directive({
  providers: [provideQdsAlertBannerContext()],
  selector: "[q-alert-banner-root]",
  standalone: false,
})
export class AlertBannerRootDirective
  implements SignalifyInput<QdsAlertBannerApiProps>, OnInit
{
  /**
   * Accessible label for the close button.
   *
   * @default 'Close'
   */
  readonly closeButtonAriaLabel = input<string>()

  /**
   * The document's text/writing direction.
   *
   * @default "ltr"
   */
  readonly dir = input<Direction>()

  /**
   * Governs the color of the banner and its icon.
   *
   * @default 'info'
   */
  readonly emphasis = input<QdsAlertBannerEmphasis>()

  /**
   * The visual style of the banner.
   *
   * @default 'strong'
   */
  readonly variant = input<QdsAlertBannerVariant>()

  /**
   * Event emitted when the close button is clicked.
   */
  readonly closed = output<void>()

  protected readonly qdsAlertBannerService = inject(
    QdsAlertBannerContextService,
  )

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsAlertBannerService.context().getRootBindings(),
  )

  ngOnInit() {
    this.qdsAlertBannerService.init(
      computed<QdsAlertBannerContextValue>(() => ({
        ...createQdsAlertBannerApi(
          {
            closeButtonAriaLabel: this.closeButtonAriaLabel(),
            dir: this.dir(),
            emphasis: this.emphasis(),
            variant: this.variant(),
          },
          normalizeProps,
        ),
        onClose: () => this.closed.emit(),
      })),
    )

    this.trackBindings()
  }
}
