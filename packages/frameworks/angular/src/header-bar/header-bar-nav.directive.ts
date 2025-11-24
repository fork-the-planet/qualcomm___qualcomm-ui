// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsHeaderBarContext} from "./qds-header-bar-context.service"

@Directive({
  selector: "[q-header-bar-nav]",
  standalone: false,
})
export class HeaderBarNavDirective implements OnInit {
  protected readonly qdsHeaderBarContext = useQdsHeaderBarContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsHeaderBarContext().getNavBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
