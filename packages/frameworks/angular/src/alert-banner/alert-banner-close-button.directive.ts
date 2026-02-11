// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, type OnInit} from "@angular/core"
import {X} from "lucide-angular"

import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import {QuiPreloadDirective} from "@qualcomm-ui/angular/transitions"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsAlertBannerContext} from "./qds-alert-banner-context.service"

@Component({
  hostDirectives: [QuiPreloadDirective],
  providers: [provideIcons({X})],
  selector: "[q-alert-banner-close-button]",
  standalone: false,
  template: `
    <ng-content>
      <svg qIcon="X" [q-bind]="inlineIconButtonApi().getIconBindings()"></svg>
    </ng-content>
  `,
})
export class AlertBannerCloseButtonDirective implements OnInit {
  protected readonly qdsContext = useQdsAlertBannerContext()

  protected readonly buttonEmphasis = computed(() => {
    const context = this.qdsContext()
    if (context.variant === "strong") {
      return context.emphasis === "warning"
        ? "persistent-black"
        : "persistent-white"
    }
    return undefined
  })

  protected readonly inlineIconButtonApi = useInlineIconButtonApi({
    emphasis: this.buttonEmphasis,
    size: "md",
    variant: "fixed",
  })

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      {onclick: () => this.qdsContext().onClose?.()},
      this.qdsContext().getCloseButtonBindings(),
      this.inlineIconButtonApi().getRootBindings(),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
