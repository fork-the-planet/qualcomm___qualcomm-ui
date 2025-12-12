// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FieldApiProps} from "@qualcomm-ui/core/field"
import type {
  InputCounterBindings,
  InputErrorTextBindings,
  InputHintBindings,
  InputInputBindings,
  InputLabelBindings,
  InputRootBindings,
} from "@qualcomm-ui/core/input"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  CommonProperties,
  EffectSchema,
  IdRegistrationProps,
  JSX,
  MachineSchema,
  ScopeWithIds,
} from "@qualcomm-ui/utils/machine"

export interface TextAreaElementIds {
  counter: string
  errorText: string
  hint: string
  input: string
  label: string
}

export interface TextAreaApiProps
  extends FieldApiProps,
    CommonProperties,
    DirectionProperty {
  /**
   * The initial value of the input when rendered.
   * Use when you don't need to control the value of the input.
   */
  defaultValue?: string | undefined

  /**
   * The id of the form that the input belongs to.
   */
  form?: string | undefined

  /**
   * The ids of the elements that are associated with the input. These will be
   * automatically generated if omitted.
   */
  ids?: TextAreaElementIds | undefined

  /**
   * The maximum number of characters allowed in the textarea.
   */
  maxLength?: number | undefined

  /**
   * The name of the input field. Useful for form submission.
   */
  name?: string | undefined

  /**
   * The callback invoked when the field is focused or blurred.
   */
  onFocusChange?: ((focused: boolean) => void) | undefined

  /**
   * The callback invoked when the value changes.
   */
  onValueChange?: ((value: string) => void) | undefined

  /**
   * The controlled value of the input
   */
  value?: string | undefined
}

export interface TextAreaScope extends ScopeWithIds<TextAreaSchema> {}

interface TextAreaContext {
  fieldsetDisabled: boolean
  focused: boolean
  focusVisible: boolean
  value: string
}

export interface TextAreaSchema extends MachineSchema {
  actions: ActionSchema<
    "setValue" | "setFocused" | "focusInputEl" | "syncInputValue"
  >
  computed: {
    disabled: boolean
  }
  context: TextAreaContext
  effects: EffectSchema<"trackFormControlState">
  events:
    | {
        focused: boolean
        focusVisible: boolean
        type: "FOCUSED.SET"
      }
    | {
        type: "VALUE.SET"
        value: string
      }
    | {type: "INPUT.FOCUS"}
  ids: TextAreaElementIds
  props: RequiredBy<TextAreaApiProps, "defaultValue" | "dir">
  state: "idle"
}

export interface TextAreaScopeAttribute {
  "data-scope": "text-area"
}

interface CommonBindings
  extends Required<DirectionProperty>,
    TextAreaScopeAttribute {}

export interface TextAreaRootBindings
  extends CommonBindings,
    InputRootBindings {}

export interface TextAreaLabelBindings
  extends CommonBindings,
    InputLabelBindings {}

export interface TextAreaCounterBindings
  extends CommonBindings,
    InputCounterBindings {}

export interface TextAreaErrorTextBindings
  extends CommonBindings,
    InputErrorTextBindings {}

export interface TextAreaHintBindings
  extends CommonBindings,
    InputHintBindings {
  hidden: boolean
}

export interface TextAreaInputBindings
  extends CommonBindings,
    Omit<InputInputBindings, "onChange"> {
  autoComplete: "off"
  autoCorrect: "off"
  "data-disabled": BooleanDataAttr
  "data-readonly": BooleanDataAttr
  onChange: JSX.ChangeEventHandler<HTMLTextAreaElement>
  onClick: JSX.MouseEventHandler<HTMLElement>
  readOnly: boolean | undefined
  spellCheck: "false"
}

export interface TextAreaApi {
  disabled: boolean | undefined
  focusInput(): void
  invalid: boolean | undefined
  maxLength: number | undefined
  required: boolean | undefined
  setValue(value: string): void
  value: string

  // group: element prop getters
  getCounterBindings(props: IdRegistrationProps): TextAreaCounterBindings
  getErrorTextBindings(props: IdRegistrationProps): TextAreaErrorTextBindings
  getHintBindings(props: IdRegistrationProps): TextAreaHintBindings
  getInputBindings(props: IdRegistrationProps): TextAreaInputBindings
  getLabelBindings(props: IdRegistrationProps): TextAreaLabelBindings
  getRootBindings(): TextAreaRootBindings
}
