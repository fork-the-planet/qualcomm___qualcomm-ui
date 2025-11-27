import {Component, computed, inject, input, type OnInit} from "@angular/core"

import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  provideTreeNodePropsContext,
  TreeNodePropsContextService,
  useTreeContext,
} from "@qualcomm-ui/angular-core/tree"
import type {NodeProps} from "@qualcomm-ui/core/tree"
import type {TreeNode} from "@qualcomm-ui/utils/collection"

@Component({
  providers: [provideTreeNodePropsContext()],
  selector: "q-tree-nodes",
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: ``,
})
export class TreeNodesComponent<T extends TreeNode>
  implements SignalifyInput<NodeProps<T>>, OnInit
{
  /**
   * The index path of the tree node
   */
  readonly indexPath = input.required<number[]>()

  /**
   * The tree node
   *
   * @inheritDoc
   */
  readonly node = input.required<T>()

  protected treeContext = useTreeContext()

  readonly childNodes = computed(() => {
    return this.treeContext().collection.getNodeChildren(this.node())
  })

  protected readonly treeNodePropsContextService = inject(
    TreeNodePropsContextService,
    {self: true},
  )

  ngOnInit() {
    this.treeNodePropsContextService.init(
      computed(() => ({
        indexPath: this.indexPath(),
        node: this.node(),
      })),
    )
  }
}
