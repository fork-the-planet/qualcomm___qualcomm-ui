// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsHeaderBarContext} from "./qds-header-bar-context.service.js"

@Directive({
  selector: "[q-header-bar-window-controls]",
  standalone: false,
})
export class HeaderBarWindowControlsDirective implements OnInit {
  protected readonly qdsHeaderBarContext = useQdsHeaderBarContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsHeaderBarContext().getWindowControlsBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
