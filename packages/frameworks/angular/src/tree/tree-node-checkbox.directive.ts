import {Component, computed} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CoreTreeNodeCheckboxDirective,
  useTreeNodeStateContext,
} from "@qualcomm-ui/angular-core/tree"
import {createQdsCheckmarkApi} from "@qualcomm-ui/qds-core/checkmark"

@Component({
  selector: "[q-tree-node-checkbox]",
  standalone: false,
  template: `
    <ng-content>
      @if (nodeState().checked) {
        <q-checkmark-icon
          size="md"
          [indeterminate]="nodeState().checked === 'indeterminate'"
        />
      }
    </ng-content>
  `,
})
export class TreeNodeCheckboxDirective extends CoreTreeNodeCheckboxDirective {
  protected readonly nodeState = useTreeNodeStateContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        createQdsCheckmarkApi(
          {
            checked: this.nodeState().checked === true,
            disabled: this.nodeState().disabled,
            indeterminate: this.nodeState().checked === "indeterminate",
            size: "md",
          },
          normalizeProps,
        ).getRootBindings(),
      ),
    )
  }
}
