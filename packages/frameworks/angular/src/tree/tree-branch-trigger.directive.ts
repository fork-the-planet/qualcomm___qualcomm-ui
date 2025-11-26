import {computed, Directive} from "@angular/core"

import {CoreTreeBranchTriggerDirective} from "@qualcomm-ui/angular-core/tree"

import {useQdsTreeContext} from "./qds-tree-context.service"

@Directive({
  selector: "[q-tree-branch-trigger]",
  standalone: false,
})
export class TreeBranchTriggerDirective extends CoreTreeBranchTriggerDirective {
  protected qdsContext = useQdsTreeContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getBranchTriggerBindings()),
    )
  }
}
