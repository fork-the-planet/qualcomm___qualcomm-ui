import {Directive} from "@angular/core"

import type {TreeNode} from "@qualcomm-ui/utils/collection"

import type {TreeLeafTemplateContext} from "./qds-tree-context.service"

@Directive({
  selector: "ng-template[q-tree-leaf]",
  standalone: false,
})
export class TreeLeafDirective {
  /**
   * Type guard for the context, provides intellisense for the context in the
   * template.
   */
  // TODO: the type argument probably won't work here.
  static ngTemplateContextGuard<T extends TreeNode>(
    dir: TreeLeafDirective,
    ctx: unknown,
  ): ctx is {$implicit: TreeLeafTemplateContext<T>} {
    return true
  }
}
