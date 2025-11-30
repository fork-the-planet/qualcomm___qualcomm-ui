// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, Component, input} from "@angular/core"

import {useComboboxContext} from "@qualcomm-ui/angular-core/combobox"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

@Component({
  selector: "q-combobox-items",
  standalone: false,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    @for (
      item of comboboxContext().collection.items;
      track comboboxContext().collection.getItemValue(item)
    ) {
      <div q-combobox-item [item]="item">
        @if (highlightMatchingText()) {
          <span
            ignoreCase
            q-combobox-item-text
            q-highlight
            [query]="comboboxContext().inputValue"
            [text]="comboboxContext().collection.stringifyItem(item)"
          ></span>
        } @else {
          <span q-combobox-item-text>
            {{ comboboxContext().collection.stringifyItem(item) }}
          </span>
        }
        <span q-combobox-item-indicator></span>
      </div>
    }
  `,
})
export class ComboboxItemsComponent {
  /**
   * Set to `true` to highlight option text matches during filtering.
   */
  readonly highlightMatchingText = input<boolean | undefined, Booleanish>(
    undefined,
    {transform: booleanAttribute},
  )

  protected readonly comboboxContext = useComboboxContext()
}
