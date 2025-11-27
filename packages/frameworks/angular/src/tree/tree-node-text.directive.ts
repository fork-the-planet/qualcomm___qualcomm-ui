import {Directive} from "@angular/core"

import {CoreTreeNodeTextDirective} from "@qualcomm-ui/angular-core/tree"

@Directive({
  selector: "[q-tree-node-text]",
  standalone: false,
})
export class TreeNodeTextDirective extends CoreTreeNodeTextDirective {}
