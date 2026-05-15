import type {FunctionComponent} from "react"

import {type FileInputProps, FileInput as SimpleFileInput} from "./file-input"
import {
  FileInputClearTrigger,
  type FileInputClearTriggerProps,
} from "./file-input-clear-trigger"
import {
  FileInputControl,
  type FileInputControlProps,
} from "./file-input-control"
import {
  FileInputDisplay,
  type FileInputDisplayProps,
} from "./file-input-display"
import {
  FileInputErrorText,
  type FileInputErrorTextProps,
} from "./file-input-error-text"
import {
  FileInputHiddenInput,
  type FileInputHiddenInputProps,
} from "./file-input-hidden-input"
import {FileInputLabel, type FileInputLabelProps} from "./file-input-label"
import {FileInputRoot, type FileInputRootProps} from "./file-input-root"

export type {
  FileInputClearTriggerProps,
  FileInputLabelProps,
  FileInputControlProps,
  FileInputHiddenInputProps,
  FileInputRootProps,
  FileInputErrorTextProps,
  FileInputDisplayProps,
  FileInputProps,
}

type FileInputComponent = typeof SimpleFileInput & {
  ClearTrigger: FunctionComponent<FileInputClearTriggerProps>
  Control: FunctionComponent<FileInputControlProps>
  Display: FunctionComponent<FileInputDisplayProps>
  ErrorText: FunctionComponent<FileInputErrorTextProps>
  HiddenInput: FunctionComponent<FileInputHiddenInputProps>
  Label: FunctionComponent<FileInputLabelProps>
  Root: FunctionComponent<FileInputRootProps>
}

/**
 * @since next-release
 */
export const FileInput: FileInputComponent =
  SimpleFileInput as FileInputComponent

FileInput.ClearTrigger = FileInputClearTrigger
FileInput.Label = FileInputLabel
FileInput.Control = FileInputControl
FileInput.HiddenInput = FileInputHiddenInput
FileInput.Root = FileInputRoot
FileInput.ErrorText = FileInputErrorText
FileInput.Display = FileInputDisplay
