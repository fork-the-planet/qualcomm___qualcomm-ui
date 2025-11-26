import {computed, Directive} from "@angular/core"

import {CoreTreeBranchNodeDirective} from "@qualcomm-ui/angular-core/tree"

import {useQdsTreeContext} from "./qds-tree-context.service"

@Directive({
  selector: "[q-tree-branch-node]",
  standalone: false,
})
export class TreeBranchNodeDirective extends CoreTreeBranchNodeDirective {
  protected qdsContext = useQdsTreeContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getBranchNodeBindings()),
    )
  }
}
