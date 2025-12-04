import {Component} from "@angular/core"
import {RouterLink} from "@angular/router"

import {TreeModule} from "@qualcomm-ui/angular/tree"
import {createTreeCollection} from "@qualcomm-ui/core/tree"

interface Node {
  id: string
  name: string
  nodes?: Node[]
  pathname?: string
}

@Component({
  imports: [TreeModule, RouterLink],
  selector: "tree-links-demo",
  template: `
    <div
      class="w-full max-w-sm"
      q-tree-root
      [collection]="collection"
      [defaultExpandedValue]="['components']"
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
            @if (branch.node.pathname) {
              <a q-tree-branch-node [routerLink]="branch.node.pathname">
                <div q-tree-node-indicator></div>
                <div q-tree-branch-trigger></div>
                <span q-tree-node-text>{{ branch.node.name }}</span>
              </a>
            } @else {
              <div q-tree-branch-node>
                <div q-tree-node-indicator></div>
                <div q-tree-branch-trigger></div>
                <span q-tree-node-text>{{ branch.node.name }}</span>
              </div>
            }
          </ng-template>

          <ng-template
            let-leaf
            q-tree-leaf-template
            [rootNode]="collection.rootNode"
          >
            <!-- preview -->
            @if (leaf.node.pathname) {
              <a q-tree-leaf-node [routerLink]="leaf.node.pathname">
                <div q-tree-node-indicator></div>
                <span q-tree-node-text>{{ leaf.node.name }}</span>
              </a>
            } @else {
              <div q-tree-leaf-node>
                <div q-tree-node-indicator></div>
                <span q-tree-node-text>{{ leaf.node.name }}</span>
              </div>
            }
            <!-- preview -->
          </ng-template>
        </q-tree-nodes>
      }
    </div>
  `,
})
export class TreeLinksDemo {
  collection = createTreeCollection<Node>({
    nodeChildren: "nodes",
    nodeText: (node) => node.name,
    nodeValue: (node) => node.id,
    rootNode: {
      id: "ROOT",
      name: "",
      nodes: [
        {
          id: "components",
          name: "Components",
          nodes: [
            {id: "switch", name: "Switch", pathname: "/components/switch"},
            {id: "tooltip", name: "Tooltip", pathname: "/components/tooltip"},
            {id: "tree", name: "Tree", pathname: "/components/tree"},
          ],
        },
      ],
    },
  })
}
