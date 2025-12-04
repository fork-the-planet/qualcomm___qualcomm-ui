// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input} from "@angular/core"

import {useCollapsibleContext} from "@qualcomm-ui/angular-core/collapsible"
import {useId} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {CoreTreeBranchContentDirective} from "@qualcomm-ui/angular-core/tree"
import {collapsibleClasses} from "@qualcomm-ui/qds-core/collapsible"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSideNavContext} from "./qds-side-nav-context.service"

@Directive({
  selector: "[q-side-nav-branch-content]",
  standalone: false,
})
export class SideNavBranchContentDirective extends CoreTreeBranchContentDirective {
  protected qdsContext = useQdsSideNavContext()

  readonly id = input<string>()

  protected readonly hostId = computed(() => useId(this, this.id()))

  protected collapsibleContext = useCollapsibleContext()

  protected override readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.treeContext().getBranchContentBindings(this.treeNodePropsContext()),
      this.collapsibleContext().getRootBindings(),
      this.collapsibleContext().getContentBindings({id: this.hostId()}),
      {class: collapsibleClasses.content},
      this.qdsContext().getBranchContentBindings(),
    ),
  )
}
