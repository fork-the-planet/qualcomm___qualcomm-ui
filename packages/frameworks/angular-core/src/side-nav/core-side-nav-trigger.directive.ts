// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, input, type OnInit} from "@angular/core"

import {useId} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useSideNavContext} from "./side-nav-context.service"

@Directive()
export class CoreSideNavTriggerDirective implements OnInit {
  /**
   * HTML id attribute. If omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  protected readonly sideNavContext = useSideNavContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.sideNavContext().getTriggerBindings({
      id: useId(this, this.id()),
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
