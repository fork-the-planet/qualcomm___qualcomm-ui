// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useTreeContext} from "./tree-context.service"
import {useTreeNodePropsContext} from "./tree-node-props-context.service"

@Directive()
export class CoreTreeBranchDirective implements OnInit {
  protected readonly treeContext = useTreeContext()

  protected readonly treeNodePropsContext = useTreeNodePropsContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.treeContext().getBranchBindings(this.treeNodePropsContext())
  })

  ngOnInit() {
    this.trackBindings()
  }
}
