import {computed, Directive, input} from "@angular/core"

import {useCollapsibleContext} from "@qualcomm-ui/angular-core/collapsible"
import {useId} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {CoreTreeBranchContentDirective} from "@qualcomm-ui/angular-core/tree"
import {collapsibleClasses} from "@qualcomm-ui/qds-core/collapsible"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTreeContext} from "./qds-tree-context.service"

@Directive({
  selector: "[q-tree-branch-content]",
  standalone: false,
})
export class TreeBranchContentDirective extends CoreTreeBranchContentDirective {
  /**
   * HTML {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()

  protected readonly hostId = computed(() => useId(this, this.id()))

  protected qdsContext = useQdsTreeContext()
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
