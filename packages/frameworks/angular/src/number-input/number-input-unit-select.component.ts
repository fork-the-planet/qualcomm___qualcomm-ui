// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  Component,
  computed,
  effect,
  inject,
  input,
  type OnInit,
  output,
  signal,
  type Signal,
  untracked,
} from "@angular/core"
import {ChevronDown, ChevronUp} from "lucide-angular"

import {
  provideQdsMenuContext,
  QdsMenuContextService,
} from "@qualcomm-ui/angular/menu"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CoreMenuRootDirective,
  provideMenuContext,
  provideMenuMachineContext,
  provideMenuTriggerContext,
  useMenuContext,
} from "@qualcomm-ui/angular-core/menu"
import {useNumberInputContext} from "@qualcomm-ui/angular-core/number-input"
import {providePresenceContext} from "@qualcomm-ui/angular-core/presence"
import {createQdsMenuApi} from "@qualcomm-ui/qds-core/menu"
import type {UnitOption} from "@qualcomm-ui/qds-core/number-input"

import {useQdsNumberInputContext} from "./qds-number-input-context.service"

export type {UnitOption}

@Component({
  providers: [
    provideMenuContext(),
    provideMenuTriggerContext(),
    provideMenuMachineContext(),
    providePresenceContext(),
    provideQdsMenuContext(),
    provideIcons({ChevronDown, ChevronUp}),
  ],
  selector: "q-number-input-unit-select",
  standalone: false,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    <button q-menu-trigger [q-bind]="unitSelectBindings()">
      <span>{{ selectedLabel() }}</span>
      <svg
        data-part="chevron"
        size="sm"
        [qIcon]="menuContext().open ? 'ChevronUp' : 'ChevronDown'"
      ></svg>
    </button>
    <ng-template qPortal>
      <div q-menu-positioner>
        <div q-menu-content>
          <div
            q-menu-radio-item-group
            [value]="selectedValue()"
            (valueChange)="onUnitChange($event)"
          >
            @for (option of options(); track option.value) {
              <button q-menu-radio-item [value]="option.value">
                <span q-menu-item-label>
                  {{ option.displayText ?? option.label }}
                </span>
                <span q-menu-item-indicator></span>
              </button>
            }
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class NumberInputUnitSelectComponent
  extends CoreMenuRootDirective
  implements OnInit
{
  /**
   * The initial selected unit. Defaults to the first option if not provided.
   */
  readonly defaultUnit = input<string>()

  /**
   * Array of unit options to display in the dropdown.
   */
  readonly options = input.required<UnitOption[]>()

  /**
   * Emits when the selected unit changes.
   */
  readonly unitChange = output<string>()

  /**
   * The currently selected value (internal state).
   */
  protected readonly selectedValue = signal<string>("")

  protected readonly numberInputContext = useNumberInputContext()
  protected readonly qdsNumberInputContext = useQdsNumberInputContext()
  protected readonly qdsMenuService = inject(QdsMenuContextService)
  protected readonly menuContext = useMenuContext()

  protected readonly unitSelectBindings = computed(() => ({
    ...this.numberInputContext().getUnitSelectBindings(),
    ...this.qdsNumberInputContext().getUnitSelectBindings(),
  }))

  constructor() {
    super()

    effect(() => {
      const opts = this.options()
      const defaultVal = this.defaultUnit()

      untracked(() => {
        const currentValue = this.selectedValue()
        const isValidSelection =
          currentValue !== "" && opts.some((opt) => opt.value === currentValue)

        if (isValidSelection) {
          return
        }

        const nextValue = opts.some((opt) => opt.value === defaultVal)
          ? defaultVal
          : (opts[0]?.value ?? "")

        if (nextValue !== currentValue) {
          this.selectedValue.set(nextValue ?? "")
        }
      })
    })
  }

  protected readonly selectedLabel: Signal<string> = computed(() => {
    const currentValue = this.selectedValue()
    const opts = this.options()
    const selected = opts.find((opt) => opt.value === currentValue)
    return selected?.label ?? ""
  })

  protected onUnitChange(value: string | undefined): void {
    if (value) {
      this.selectedValue.set(value)
      this.unitChange.emit(value)
    }
  }

  override ngOnInit() {
    super.ngOnInit()

    const qdsMenuApi = computed(() => {
      const inputSize = this.qdsNumberInputContext().size
      const menuSize = inputSize === "lg" ? "md" : inputSize
      return createQdsMenuApi({size: menuSize}, normalizeProps)
    })

    this.qdsMenuService.init(qdsMenuApi)
  }
}
