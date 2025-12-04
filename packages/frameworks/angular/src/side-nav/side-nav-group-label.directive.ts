// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsSideNavContext} from "./qds-side-nav-context.service"

@Directive({
  selector: "[q-side-nav-group-label]",
  standalone: false,
})
export class SideNavGroupLabelDirective implements OnInit {
  protected readonly qdsContext = useQdsSideNavContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getGroupLabelBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
