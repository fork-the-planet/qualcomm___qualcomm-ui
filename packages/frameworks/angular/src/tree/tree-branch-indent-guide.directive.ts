import {computed, Directive} from "@angular/core"

import {CoreTreeBranchIndentGuideDirective} from "@qualcomm-ui/angular-core/tree"

import {useQdsTreeContext} from "./qds-tree-context.service"

@Directive({
  selector: "[q-tree-branch-indent-guide]",
  standalone: false,
})
export class TreeBranchIndentGuideDirective extends CoreTreeBranchIndentGuideDirective {
  protected qdsContext = useQdsTreeContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getBranchIndentGuideBindings()),
    )
  }
}
