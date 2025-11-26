import {computed, Directive} from "@angular/core"

import {provideCollapsibleContext} from "@qualcomm-ui/angular-core/collapsible"
import {CoreTreeBranchDirective} from "@qualcomm-ui/angular-core/tree"

import {useQdsTreeContext} from "./qds-tree-context.service"

@Directive({
  providers: [provideCollapsibleContext()],
  selector: "[q-tree-branch]",
  standalone: false,
})
export class TreeBranchDirective extends CoreTreeBranchDirective {
  protected qdsContext = useQdsTreeContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getBranchBindings()),
    )
  }
}
