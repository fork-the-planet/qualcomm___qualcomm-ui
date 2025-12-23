// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {ActionSchema, JSX, MachineSchema} from "@qualcomm-ui/utils/machine"

export interface ToggleApiProps extends DirectionProperty {
  /**
   * The default pressed state of the toggle.
   */
  defaultPressed?: boolean | undefined

  /**
   * Whether the toggle is disabled.
   */
  disabled?: boolean | undefined

  /**
   * Event handler called when the pressed state of the toggle changes.
   */
  onPressedChange?: ((pressed: boolean) => void) | undefined

  /**
   * The pressed state of the toggle.
   */
  pressed?: boolean | undefined
}

export interface ToggleSchema extends MachineSchema {
  actions: ActionSchema<"setPressed" | "togglePressed">
  context: {
    pressed: boolean
  }
  events:
    | {type: "PRESS.TOGGLE"}
    | {type: "PRESS.SET"; value: boolean | undefined}
  props: RequiredBy<ToggleApiProps, "dir">
  state: "idle"
}

export interface ToggleCommonBindings extends Required<DirectionProperty> {
  "data-scope": "toggle"
}

export interface ToggleIndicatorBindings extends ToggleCommonBindings {
  "data-disabled": BooleanDataAttr
  "data-part": "indicator"
  "data-pressed": BooleanDataAttr
  "data-state": "on" | "off"
}

export interface ToggleRootBindings extends ToggleCommonBindings {
  "aria-pressed": BooleanAriaAttr
  "data-disabled": BooleanDataAttr
  "data-part": "root"
  "data-pressed": BooleanDataAttr
  "data-state": "on" | "off"
  disabled: boolean | undefined
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface ToggleApi {
  /**
   * Whether the toggle is disabled.
   */
  disabled: boolean

  /**
   * Whether the toggle is pressed.
   */
  pressed: boolean

  /**
   * Sets the pressed state of the toggle.
   */
  setPressed: (pressed: boolean | undefined) => void

  // group: bindings
  getIndicatorBindings: () => ToggleIndicatorBindings
  getRootBindings: () => ToggleRootBindings
}
