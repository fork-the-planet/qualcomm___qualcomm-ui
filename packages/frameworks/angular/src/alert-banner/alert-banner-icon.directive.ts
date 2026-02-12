// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input, type OnInit} from "@angular/core"
import {
  BellRing,
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
} from "lucide-angular"

import type {LucideIcon} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {QdsAlertBannerEmphasis} from "@qualcomm-ui/qds-core/alert-banner"

import {useQdsAlertBannerContext} from "./qds-alert-banner-context.service"

const icons: Record<QdsAlertBannerEmphasis, LucideIcon> = {
  danger: CircleAlert,
  info: Info,
  neutral: BellRing,
  success: CircleCheck,
  warning: TriangleAlert,
}

@Component({
  selector: "[q-alert-banner-icon]",
  standalone: false,
  template: `
    @if (resolvedIcon()) {
      <svg size="lg" [qIcon]="resolvedIcon()!"></svg>
    } @else {
      <ng-content />
    }
  `,
})
export class AlertBannerIconDirective implements OnInit {
  /**
   * Override the icon displayed in the banner. When this prop is omitted,
   * the icon is determined by the emphasis prop.
   */
  readonly icon = input<LucideIcon>()

  protected readonly qdsContext = useQdsAlertBannerContext()

  protected readonly resolvedIcon = computed(() => {
    return this.icon() || icons[this.qdsContext().emphasis]
  })

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getIconBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
