import {TextArea as SimpleTextArea} from "./text-area"
import {TextAreaCounter, type TextAreaCounterProps} from "./text-area-counter"
import {
  TextAreaErrorText,
  type TextAreaErrorTextProps,
} from "./text-area-error-text"
import {TextAreaHint, type TextAreaHintProps} from "./text-area-hint"
import {TextAreaInput, type TextAreaInputProps} from "./text-area-input"
import {TextAreaLabel, type TextAreaLabelProps} from "./text-area-label"
import {TextAreaRoot, type TextAreaRootProps} from "./text-area-root"

export type {
  TextAreaRootProps,
  TextAreaLabelProps,
  TextAreaInputProps,
  TextAreaHintProps,
  TextAreaErrorTextProps,
  TextAreaCounterProps,
}

type TextAreaComponent = typeof SimpleTextArea & {
  /**
   * Character counter displayed opposite the textarea label. Renders a `<div>`
   * element by default.
   */
  Counter: typeof TextAreaCounter
  /**
   * Error message displayed when the textarea is invalid. Renders a `<div>` element
   * by default.
   */
  ErrorText: typeof TextAreaErrorText
  /**
   * Helper text displayed below the textarea. Renders a `<div>` element by default.
   */
  Hint: typeof TextAreaHint
  /**
   * The text area element. Renders a `<textarea>` element.
   */
  Input: typeof TextAreaInput
  /**
   * An accessible label that is automatically associated with the input. Renders a
   * `<label>` element by default.
   */
  Label: typeof TextAreaLabel
  /**
   * Groups all parts of the text-area. Renders a `<div>` element by default.
   */
  Root: typeof TextAreaRoot
}

export const TextArea: TextAreaComponent = SimpleTextArea as TextAreaComponent

TextArea.Counter = TextAreaCounter
TextArea.ErrorText = TextAreaErrorText
TextArea.Hint = TextAreaHint
TextArea.Input = TextAreaInput
TextArea.Label = TextAreaLabel
TextArea.Root = TextAreaRoot
