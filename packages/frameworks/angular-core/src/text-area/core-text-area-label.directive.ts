// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useTextAreaContext} from "./text-area-context.service"

@Directive()
export class CoreTextAreaLabelDirective implements OnInit {
  readonly id = input<string>()

  private readonly hostId = computed(() => useId(this, this.id()))

  protected readonly textAreaContext = useTextAreaContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.textAreaContext().getLabelBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    }),
  )

  private readonly onDestroy = useOnDestroy()

  ngOnInit() {
    this.trackBindings()
  }
}
