// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useSideNavContext} from "./side-nav-context.service"

@Directive()
export class CoreSideNavHeaderDirective implements OnInit {
  protected readonly sideNavContext = useSideNavContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.sideNavContext().getHeaderBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
