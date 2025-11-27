import {computed, Directive} from "@angular/core"

import {CoreTreeNodeIndicatorDirective} from "@qualcomm-ui/angular-core/tree"

import {useQdsTreeContext} from "./qds-tree-context.service"

@Directive({
  selector: "[q-tree-node-indicator]",
  standalone: false,
})
export class TreeNodeIndicatorDirective extends CoreTreeNodeIndicatorDirective {
  protected readonly qdsContext = useQdsTreeContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getNodeIndicatorBindings()),
    )
  }
}
