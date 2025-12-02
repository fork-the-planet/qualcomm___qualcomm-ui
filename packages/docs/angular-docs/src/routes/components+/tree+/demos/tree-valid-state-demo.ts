import {Component} from "@angular/core"

import {TreeModule} from "@qualcomm-ui/angular/tree"
import {createTreeCollection} from "@qualcomm-ui/core/tree"

interface Node {
  id: string
  name: string
  nodes?: Node[]
}

@Component({
  imports: [TreeModule],
  selector: "tree-valid-state-demo",
  template: `
    <!-- preview -->
    <div
      class="w-full max-w-sm"
      q-tree-root
      [collection]="collection"
      [defaultCheckedValue]="['elite', 'plus']"
      [defaultExpandedValue]="['qualcomm', 'sdx']"
    >
      <!-- preview -->
      @for (
        node of collection.rootNode.nodes;
        let i = $index;
        track collection.getNodeValue(node)
      ) {
        <q-tree-nodes [indexPath]="[i]" [node]="node">
          <ng-template
            let-branch
            q-tree-branch-template
            [rootNode]="collection.rootNode"
          >
            <div q-tree-branch-node>
              <div q-tree-branch-trigger></div>
              <span q-tree-node-checkbox></span>
              <span q-tree-node-text>{{ branch.node.name }}</span>
            </div>
          </ng-template>

          <ng-template
            let-leaf
            q-tree-leaf-template
            [rootNode]="collection.rootNode"
          >
            <div q-tree-leaf-node>
              <span q-tree-node-checkbox></span>
              <span q-tree-node-text>{{ leaf.node.name }}</span>
            </div>
          </ng-template>
        </q-tree-nodes>
      }
    </div>
  `,
})
export class TreeValidStateDemo {
  collection = createTreeCollection<Node>({
    rootNode: {
      id: "ROOT",
      name: "",
      nodes: [
        {
          id: "qualcomm",
          name: "Qualcomm",
          nodes: [
            {
              id: "sdx",
              name: "Snapdragon X",
              nodes: [
                {id: "elite", name: "Snapdragon X Elite"},
                {id: "plus", name: "Snapdragon X Plus"},
              ],
            },
          ],
        },
      ],
    },
  })
}
