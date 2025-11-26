import {NgModule} from "@angular/core"

import {TreeBranchContentDirective} from "./tree-branch-content.directive"
import {TreeBranchIndentGuideDirective} from "./tree-branch-indent-guide.directive"
import {TreeBranchNodeDirective} from "./tree-branch-node.directive"
import {TreeBranchTriggerDirective} from "./tree-branch-trigger.directive"
import {TreeBranchDirective} from "./tree-branch.directive"
import {TreeRootDirective} from "./tree-root.directive"

@NgModule({
  declarations: [
    TreeRootDirective,
    TreeBranchDirective,
    TreeBranchContentDirective,
    TreeBranchIndentGuideDirective,
    TreeBranchNodeDirective,
    TreeBranchTriggerDirective,
  ],
  exports: [
    TreeRootDirective,
    TreeBranchDirective,
    TreeBranchContentDirective,
    TreeBranchIndentGuideDirective,
    TreeBranchNodeDirective,
    TreeBranchTriggerDirective,
  ],
  imports: [],
})
export class TreeModule {}
