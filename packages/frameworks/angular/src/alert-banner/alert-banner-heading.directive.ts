// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsAlertBannerContext} from "./qds-alert-banner-context.service"

@Directive({
  selector: "[q-alert-banner-heading]",
  standalone: false,
})
export class AlertBannerHeadingDirective implements OnInit {
  protected readonly qdsContext = useQdsAlertBannerContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getHeadingBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
