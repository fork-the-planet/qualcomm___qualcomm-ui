// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  HostAttributeToken,
  inject,
  input,
  type OnInit,
  output,
} from "@angular/core"

import {
  type ButtonGroupContextValue,
  provideQdsButtonGroupContext,
  QdsButtonGroupContextService,
} from "@qualcomm-ui/angular/button"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {
  type QdsButtonDensity,
  type QdsButtonEmphasis,
  type QdsButtonSize,
  type QdsButtonVariant,
} from "@qualcomm-ui/qds-core/button"
import {getQdsSplitButtonBindings} from "@qualcomm-ui/qds-core/menu"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

@Component({
  providers: [provideQdsButtonGroupContext()],
  selector: "[q-menu-split-button]",
  standalone: false,
  template: `
    <ng-content select="[q-button]">
      <button
        q-button
        [endIcon]="endIcon()"
        [startIcon]="startIcon()"
        (click)="actionClicked.emit($event)"
      >
        <ng-content />
      </button>
    </ng-content>
    <ng-content select="button[q-menu-icon-button]">
      <button aria-label="More options" q-menu-icon-button></button>
    </ng-content>
  `,
})
export class MenuSplitButtonComponent implements OnInit {
  /**
   * The density of both buttons.
   */
  readonly density = input<QdsButtonDensity>()

  /**
   * Disables both buttons.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The emphasis applied to both buttons.
   */
  readonly emphasis = input<QdsButtonEmphasis>()

  /**
   * Icon positioned after the primary action label.
   */
  readonly endIcon = input<LucideIconOrString>()

  /**
   * The size of both buttons.
   */
  readonly size = input<QdsButtonSize>()

  /**
   * Icon positioned before the primary action label.
   */
  readonly startIcon = input<LucideIconOrString>()

  /**
   * The variant applied to both buttons.
   */
  readonly variant = input<QdsButtonVariant>()

  /**
   * Emitted when the default action button is clicked.
   */
  readonly actionClicked = output<MouseEvent>()

  protected readonly ariaLabel = inject(new HostAttributeToken("aria-label"), {
    optional: true,
  })
  protected readonly ariaLabelledBy = inject(
    new HostAttributeToken("aria-labelledby"),
    {optional: true},
  )

  protected readonly buttonGroupService = inject(QdsButtonGroupContextService)

  protected readonly trackBindings = useTrackBindings(() =>
    getQdsSplitButtonBindings(
      {
        "aria-label": this.ariaLabel || undefined,
        "aria-labelledby": this.ariaLabelledBy || undefined,
        density: this.density(),
        disabled: this.disabled(),
        emphasis: this.emphasis(),
        size: this.size(),
        variant: this.variant(),
      },
      normalizeProps,
    ),
  )

  ngOnInit() {
    this.buttonGroupService.init(
      computed<ButtonGroupContextValue>(() => ({
        density: this.density(),
        disabled: this.disabled(),
        emphasis: this.emphasis(),
        size: this.size(),
        variant: this.variant(),
      })),
    )
    this.trackBindings()
  }
}
