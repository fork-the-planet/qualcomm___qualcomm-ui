import {Directive, inject, input, TemplateRef} from "@angular/core"

import type {TreeNode} from "@qualcomm-ui/utils/collection"

import type {TreeNodeTemplateContext} from "./qds-tree-context.service"

@Directive({
  selector: "ng-template[q-tree-leaf-template]",
  standalone: false,
})
export class TreeLeafTemplateDirective<T extends TreeNode> {
  /**
   * The root node of the tree. Used for type narrowing of the template guard.
   * Learn more here: https://angular.dev/guide/directives/structural-directives#type-narrowing-with-template-guards
   */
  readonly rootNode = input<T>()

  template = inject(TemplateRef)

  static ngTemplateContextGuard<T extends TreeNode>(
    dir: TreeLeafTemplateDirective<T>,
    ctx: unknown,
  ): ctx is TreeNodeTemplateContext<T> {
    return true
  }
}
