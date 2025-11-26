import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useTreeContext} from "./tree-context.service"
import {useTreeNodePropsContext} from "./tree-node-props-context.service"

@Directive()
export class CoreTreeBranchIndentGuideDirective implements OnInit {
  protected readonly treeContext = useTreeContext()

  protected readonly treeNodePropsContext = useTreeNodePropsContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.treeContext().getBranchIndentGuideBindings(
      this.treeNodePropsContext(),
    )
  })

  ngOnInit() {
    this.trackBindings()
  }
}
