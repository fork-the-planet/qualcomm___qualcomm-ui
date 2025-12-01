import {NgTemplateOutlet} from "@angular/common"
import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {TreeBranchContentDirective} from "./tree-branch-content.directive"
import {TreeBranchIndentGuideDirective} from "./tree-branch-indent-guide.directive"
import {TreeBranchNodeDirective} from "./tree-branch-node.directive"
import {TreeBranchTemplateDirective} from "./tree-branch-template.directive"
import {TreeBranchTriggerDirective} from "./tree-branch-trigger.directive"
import {TreeBranchDirective} from "./tree-branch.directive"
import {TreeLabelDirective} from "./tree-label.directive"
import {TreeLeafNodeDirective} from "./tree-leaf-node.directive"
import {TreeLeafTemplateDirective} from "./tree-leaf-template.directive"
import {TreeNodeActionDirective} from "./tree-node-action.directive"
import {TreeNodeIconDirective} from "./tree-node-icon.directive"
import {TreeNodeIndicatorDirective} from "./tree-node-indicator.directive"
import {TreeNodeTextDirective} from "./tree-node-text.directive"
import {TreeNodesComponent} from "./tree-nodes.component"
import {TreeRootDirective} from "./tree-root.directive"

@NgModule({
  declarations: [
    TreeRootDirective,
    TreeBranchDirective,
    TreeBranchContentDirective,
    TreeBranchIndentGuideDirective,
    TreeBranchNodeDirective,
    TreeBranchTriggerDirective,
    TreeLabelDirective,
    TreeLeafNodeDirective,
    TreeNodeActionDirective,
    TreeNodeIconDirective,
    TreeNodeIndicatorDirective,
    TreeNodeTextDirective,
    TreeLeafTemplateDirective,
    TreeBranchTemplateDirective,
    TreeNodesComponent,
  ],
  exports: [
    TreeRootDirective,
    TreeBranchDirective,
    TreeBranchContentDirective,
    TreeBranchIndentGuideDirective,
    TreeBranchNodeDirective,
    TreeBranchTriggerDirective,
    TreeLabelDirective,
    TreeLeafNodeDirective,
    TreeNodeActionDirective,
    TreeNodeIconDirective,
    TreeNodeIndicatorDirective,
    TreeNodeTextDirective,
    TreeBranchTemplateDirective,
    TreeLeafTemplateDirective,
    TreeNodesComponent,
  ],
  imports: [IconDirective, QBindDirective, NgTemplateOutlet],
})
export class TreeModule {}
