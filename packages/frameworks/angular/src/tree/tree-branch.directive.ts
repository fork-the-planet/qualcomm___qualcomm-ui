// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DOCUMENT} from "@angular/common"
import {computed, Directive, inject, Injector} from "@angular/core"

import {
  CollapsibleContextService,
  provideCollapsibleContext,
} from "@qualcomm-ui/angular-core/collapsible"
import {normalizeProps, useMachine} from "@qualcomm-ui/angular-core/machine"
import {useRenderStrategyContext} from "@qualcomm-ui/angular-core/presence"
import {
  CoreTreeBranchDirective,
  useTreeNodeStateContext,
} from "@qualcomm-ui/angular-core/tree"
import {
  type CollapsibleApiProps,
  collapsibleMachine,
  createCollapsibleApi,
} from "@qualcomm-ui/core/collapsible"

import {useQdsTreeContext} from "./qds-tree-context.service"

@Directive({
  providers: [provideCollapsibleContext()],
  selector: "[q-tree-branch]",
  standalone: false,
})
export class TreeBranchDirective extends CoreTreeBranchDirective {
  protected qdsContext = useQdsTreeContext()

  protected readonly collapsibleApi = inject(CollapsibleContextService)

  protected readonly document = inject(DOCUMENT)
  protected readonly injector = inject(Injector)
  protected readonly nodeState = useTreeNodeStateContext()
  protected readonly renderStrategyProps = useRenderStrategyContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getBranchBindings()),
    )
  }

  override ngOnInit() {
    const machine = useMachine(
      collapsibleMachine,
      computed<CollapsibleApiProps>(() => ({
        defaultOpen: false,
        disabled: this.nodeState().disabled,
        forceMeasureOnOpen: true,
        getRootNode: () => this.document,
        open: this.nodeState().expanded,
      })),
      this.injector,
    )
    this.collapsibleApi.init(
      computed(() => createCollapsibleApi(machine, normalizeProps)),
    )

    super.ngOnInit()
  }
}
