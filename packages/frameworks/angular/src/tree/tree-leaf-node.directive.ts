// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreTreeLeafNodeDirective} from "@qualcomm-ui/angular-core/tree"

import {useQdsTreeContext} from "./qds-tree-context.service"

@Directive({
  selector: "[q-tree-leaf-node]",
  standalone: false,
})
export class TreeLeafNodeDirective extends CoreTreeLeafNodeDirective {
  protected qdsContext = useQdsTreeContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getLeafNodeBindings()),
    )
  }
}
