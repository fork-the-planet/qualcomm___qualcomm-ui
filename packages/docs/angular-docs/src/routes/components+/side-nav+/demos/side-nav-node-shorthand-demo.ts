import {Component} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {SideNavModule} from "@qualcomm-ui/angular/side-nav"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

import {collection, icons} from "./items"

@Component({
  imports: [SideNavModule, IconDirective],
  providers: [provideIcons(icons)],
  selector: "side-nav-node-shorthand-demo",
  template: `
    <div class="flex justify-center">
      <!-- preview -->
      <nav q-side-nav-root [collection]="collection">
        <header q-side-nav-header>
          <div q-side-nav-header-logo>
            <svg
              class="size-8"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div q-side-nav-header-title>Qualcomm</div>
        </header>

        @for (
          node of collection.rootNode.nodes;
          let i = $index;
          track collection.getNodeValue(node)
        ) {
          <q-side-nav-nodes [indexPath]="[i]" [node]="node">
            <ng-template
              let-branch
              q-side-nav-branch-template
              [rootNode]="collection.rootNode"
            >
              <div q-side-nav-branch-node>
                @if (branch.node.icon) {
                  <svg q-side-nav-node-icon [qIcon]="branch.node.icon"></svg>
                }
                <span q-side-nav-node-text>{{ branch.node.text }}</span>
                <div q-side-nav-branch-trigger></div>
              </div>
            </ng-template>

            <ng-template
              let-leaf
              q-side-nav-leaf-template
              [rootNode]="collection.rootNode"
            >
              <div q-side-nav-leaf-node>
                <div q-side-nav-node-indicator></div>
                @if (leaf.node.icon) {
                  <svg q-side-nav-node-icon [qIcon]="leaf.node.icon"></svg>
                }
                <span q-side-nav-node-text>{{ leaf.node.text }}</span>
              </div>
            </ng-template>
          </q-side-nav-nodes>
        }
      </nav>
      <!-- preview -->
    </div>
  `,
})
export class SideNavNodeShorthandDemo {
  collection = collection
}
