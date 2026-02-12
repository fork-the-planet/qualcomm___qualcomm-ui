// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, type OnInit} from "@angular/core"

import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {useSelectItemContext} from "@qualcomm-ui/angular-core/select"
import {createQdsCheckmarkApi} from "@qualcomm-ui/qds-core/checkmark"

/**
 * Checkbox-style indicator for select items. Always visible, showing a checkbox
 * that fills when selected. Use with `selectionIndicator="checkbox"` on the
 * Select root.
 */
@Component({
  selector: "[q-select-item-checkbox]",
  standalone: false,
  template: `
    <q-checkmark-icon />
  `,
})
export class SelectItemCheckboxComponent implements OnInit {
  protected readonly itemContext = useSelectItemContext()

  protected readonly trackBindings = useTrackBindings(() => {
    const api = createQdsCheckmarkApi(
      {
        checked: this.itemContext().selected,
        disabled: this.itemContext().disabled,
        indeterminate: false,
        size: "md",
      },
      normalizeProps,
    )
    return api.getRootBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
