import {Component} from "@angular/core"

import {TreeModule} from "@qualcomm-ui/angular/tree"
import {createTreeCollection} from "@qualcomm-ui/core/tree"

interface Node {
  id: string
  nodes?: Node[]
  text: string
}

@Component({
  imports: [TreeModule],
  selector: "tree-checkbox-demo",
  template: `
    <div
      class="w-full max-w-sm"
      q-tree-root
      [collection]="collection"
      [defaultExpandedValue]="['qualcomm', 'amd', 'intel']"
    >
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
              <span q-tree-node-text>{{ branch.node.text }}</span>
            </div>
          </ng-template>

          <ng-template
            let-leaf
            q-tree-leaf-template
            [rootNode]="collection.rootNode"
          >
            <div q-tree-leaf-node>
              <div q-tree-node-indicator></div>
              <span q-tree-node-checkbox></span>
              <span q-tree-node-text>{{ leaf.node.text }}</span>
            </div>
          </ng-template>
        </q-tree-nodes>
      }
    </div>
  `,
})
export class TreeCheckboxDemo {
  collection = createTreeCollection<Node>({
    nodeText: "text",
    nodeValue: "id",
    rootNode: {
      id: "ROOT",
      nodes: [
        {
          id: "qualcomm",
          nodes: [
            {
              id: "snapdragon_x_elite",
              nodes: [
                {id: "X1E-00-1DE", text: "12-core X1E-00-1DE"},
                {id: "X1E-84-100", text: "12-core X1E-84-100"},
                {id: "X1E-80-100", text: "12-core X1E-80-100"},
                {id: "X1E-78-100", text: "12-core X1E-78-100"},
              ],
              text: "Snapdragon X Elite",
            },
            {
              id: "snapdragon_x_plus",
              nodes: [
                {id: "X1P-66-100", text: "10-core X1P-66-100"},
                {id: "X1P-64-100", text: "10-core X1P-64-100"},
                {id: "X1P-46-100", text: "8-core Plus X1P-46-100"},
                {id: "X1P-42-100", text: "8-core Plus X1P-42-100"},
              ],
              text: "Snapdragon X Plus",
            },
          ],
          text: "Qualcomm",
        },
        {
          id: "intel",
          nodes: [
            {
              id: "intel_core_ultra",
              nodes: [
                {id: "ultra9_s2", text: "Core Ultra 9 (Series 2)"},
                {id: "ultra7_s2", text: "Core Ultra 7 (Series 2)"},
                {id: "ultra5_s2", text: "Core Ultra 5 (Series 2)"},
              ],
              text: "Intel Core Ultra",
            },
            {
              id: "intel_core_i9",
              nodes: [
                {id: "i9_14th", text: "Core i9 14th Gen"},
                {id: "i9_13th", text: "Core i9 13th Gen"},
              ],
              text: "Intel Core i9",
            },
            {
              id: "intel_core_i7",
              nodes: [
                {id: "i7_14th", text: "Core i7 14th Gen"},
                {id: "i7_13th", text: "Core i7 13th Gen"},
              ],
              text: "Intel Core i7",
            },
            {
              id: "intel_core_i5",
              nodes: [
                {id: "i5_14th", text: "Core i5 14th Gen"},
                {id: "i5_13th", text: "Core i5 13th Gen"},
              ],
              text: "Intel Core i5",
            },
            {
              id: "intel_core_i3",
              nodes: [
                {id: "i3_14th", text: "Core i3 14th Gen"},
                {id: "i3_13th", text: "Core i3 13th Gen"},
              ],
              text: "Intel Core i3",
            },
          ],
          text: "Intel",
        },
        {
          id: "amd",
          nodes: [
            {
              id: "amd_threadripper",
              nodes: [
                {
                  id: "threadripper_9000",
                  text: "Ryzen Threadripper 9000 Series",
                },
                {
                  id: "threadripper_7000",
                  text: "Ryzen Threadripper 7000 Series",
                },
              ],
              text: "AMD Threadripper",
            },
            {
              id: "amd_ryzen_9",
              nodes: [
                {id: "ryzen9_9000", text: "Ryzen 9 9000 Series"},
                {id: "ryzen9_7000", text: "Ryzen 9 7000 Series"},
              ],
              text: "AMD Ryzen 9",
            },
            {
              id: "amd_ryzen_7_5",
              nodes: [
                {id: "ryzen7_9000", text: "Ryzen 7 9000 Series"},
                {id: "ryzen7_8000g", text: "Ryzen 7 8000-G Series"},
                {id: "ryzen7_8000", text: "Ryzen 7 8000 Series"},
                {id: "ryzen7_7000", text: "Ryzen 7 7000 Series"},
                {id: "ryzen5_9000", text: "Ryzen 5 9000 Series"},
                {id: "ryzen5_8000g", text: "Ryzen 5 8000-G Series"},
                {id: "ryzen5_8000", text: "Ryzen 5 8000 Series"},
                {id: "ryzen5_7000", text: "Ryzen 5 7000 Series"},
              ],
              text: "AMD Ryzen 7 / 5",
            },
          ],
          text: "AMD",
        },
      ],
      text: "",
    },
  })
}
