import {computed, Directive} from "@angular/core"

import {CoreTreeLabelDirective} from "@qualcomm-ui/angular-core/tree"

import {useQdsTreeContext} from "./qds-tree-context.service"

@Directive({
  selector: "[q-tree-label]",
  standalone: false,
})
export class TreeLabelDirective extends CoreTreeLabelDirective {
  protected qdsContext = useQdsTreeContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getLabelBindings()),
    )
  }
}
