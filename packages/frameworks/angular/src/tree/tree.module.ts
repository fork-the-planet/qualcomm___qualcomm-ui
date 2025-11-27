import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {TreeBranchContentDirective} from "./tree-branch-content.directive"
import {TreeBranchIndentGuideDirective} from "./tree-branch-indent-guide.directive"
import {TreeBranchNodeDirective} from "./tree-branch-node.directive"
import {TreeBranchTriggerDirective} from "./tree-branch-trigger.directive"
import {TreeBranchDirective} from "./tree-branch.directive"
import {TreeLabelDirective} from "./tree-label.directive"
import {TreeLeafNodeDirective} from "./tree-leaf-node.directive"
import {TreeNodeActionDirective} from "./tree-node-action.directive"
import {TreeNodeIconDirective} from "./tree-node-icon.directive"
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
  ],
  imports: [IconDirective, QBindDirective],
})
export class TreeModule {}
