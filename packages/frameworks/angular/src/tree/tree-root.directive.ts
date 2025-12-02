// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {provideRenderStrategyContext} from "@qualcomm-ui/angular-core/presence"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  CoreTreeRootDirective,
  provideTreeContext,
} from "@qualcomm-ui/angular-core/tree"
import {
  createQdsTreeApi,
  type QdsTreeApiProps,
  type QdsTreeSize,
} from "@qualcomm-ui/qds-core/tree"

import {
  provideQdsTreeContext,
  QdsTreeContextService,
} from "./qds-tree-context.service"

@Directive({
  exportAs: "treeRoot",
  providers: [
    provideTreeContext(),
    provideRenderStrategyContext(),
    provideQdsTreeContext(),
  ],
  selector: "[q-tree-root]",
  standalone: false,
})
export class TreeRootDirective
  extends CoreTreeRootDirective
  implements SignalifyInput<QdsTreeApiProps>, OnInit
{
  /**
   * The size of the tree and its elements. Governs properties like font size,
   * item padding, and icon sizes.
   *
   * @default 'md'
   */
  readonly size = input<QdsTreeSize>()

  protected readonly qdsTreeService = inject(QdsTreeContextService)

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsTreeService.context().getRootBindings()),
    )
  }

  override ngOnInit() {
    this.qdsTreeService.init(
      computed(() => createQdsTreeApi({size: this.size()}, normalizeProps)),
    )

    super.ngOnInit()
  }
}
