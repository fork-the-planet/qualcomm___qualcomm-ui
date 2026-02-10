import {Switch as SimpleSwitch} from "./switch"
import {SwitchControl, type SwitchControlProps} from "./switch-control"
import {SwitchErrorText, type SwitchErrorTextProps} from "./switch-error-text"
import {
  SwitchHiddenInput,
  type SwitchHiddenInputProps,
} from "./switch-hidden-input"
import {SwitchHint, type SwitchHintProps} from "./switch-hint"
import {SwitchLabel, type SwitchLabelProps} from "./switch-label"
import {SwitchRoot, type SwitchRootProps} from "./switch-root"
import {SwitchThumb, type SwitchThumbProps} from "./switch-thumb"

export * from "./qds-switch-context"

export type {
  SwitchControlProps,
  SwitchErrorTextProps,
  SwitchHiddenInputProps,
  SwitchHintProps,
  SwitchLabelProps,
  SwitchRootProps,
  SwitchThumbProps,
}

type SwitchComponent = typeof SimpleSwitch & {
  Control: typeof SwitchControl
  ErrorText: typeof SwitchErrorText
  HiddenInput: typeof SwitchHiddenInput
  Hint: typeof SwitchHint
  Label: typeof SwitchLabel
  Root: typeof SwitchRoot
  Thumb: typeof SwitchThumb
}

export const Switch: SwitchComponent = SimpleSwitch as SwitchComponent

Switch.Control = SwitchControl
Switch.ErrorText = SwitchErrorText
Switch.HiddenInput = SwitchHiddenInput
Switch.Hint = SwitchHint
Switch.Label = SwitchLabel
Switch.Root = SwitchRoot
Switch.Thumb = SwitchThumb
