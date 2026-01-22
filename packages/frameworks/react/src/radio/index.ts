import {Radio as SimpleRadio} from "./radio"
import {RadioControl, type RadioControlProps} from "./radio-control"
import {
  RadioHiddenInput,
  type RadioHiddenInputProps,
} from "./radio-hidden-input"
import {RadioHint, type RadioHintProps} from "./radio-hint"
import {RadioLabel, type RadioLabelProps} from "./radio-label"
import {RadioRoot, type RadioRootProps} from "./radio-root"

export * from "./radio-group"

export type {
  RadioControlProps,
  RadioHiddenInputProps,
  RadioHintProps,
  RadioLabelProps,
  RadioRootProps,
}

type RadioComponent = typeof SimpleRadio & {
  Control: typeof RadioControl
  HiddenInput: typeof RadioHiddenInput
  Hint: typeof RadioHint
  Label: typeof RadioLabel
  Root: typeof RadioRoot
}

export const Radio: RadioComponent = SimpleRadio as RadioComponent

Radio.Control = RadioControl
Radio.HiddenInput = RadioHiddenInput
Radio.Hint = RadioHint
Radio.Label = RadioLabel
Radio.Root = RadioRoot
