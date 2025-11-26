import {computed, Directive} from "@angular/core"

import {CoreTreeBranchContentDirective} from "@qualcomm-ui/angular-core/tree"

import {useQdsTreeContext} from "./qds-tree-context.service"

@Directive({
  selector: "[q-tree-branch-content]",
  standalone: false,
})
export class TreeBranchContentDirective extends CoreTreeBranchContentDirective {
  protected qdsContext = useQdsTreeContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getBranchContentBindings()),
    )
  }
}
