import type {HTMLAttributes} from "react"

import {page} from "vitest/browser"

import {TextArea, type TextAreaRootProps} from "@qualcomm-ui/react/text-area"

export const testIds = {
  counter: "text-area-counter",
  errorText: "text-area-error-text",
  focusTarget: "focus-target",
  hint: "text-area-hint",
  input: "text-area-input",
  label: "text-area-label",
  root: "text-area-root",
} as const

interface TestTextAreaProps {
  counter?: boolean
  errorText?: string
  hint?: string
  label?: string
  maxLength?: number
  placeholder?: string
}

export function clickFocusTarget() {
  return page.getByTestId(testIds.focusTarget).click()
}

export function SimpleTextArea(
  props: Omit<TextAreaRootProps, "children"> & TestTextAreaProps,
) {
  const {counter, errorText, hint, label, maxLength, placeholder, ...rest} =
    props

  return (
    <div>
      <button data-test-id={testIds.focusTarget} type="button">
        Focus target
      </button>
      <TextArea
        {...rest}
        counter={counter}
        counterProps={
          {
            "data-test-id": testIds.counter,
          } as HTMLAttributes<HTMLDivElement>
        }
        data-test-id={testIds.root}
        errorText={errorText}
        errorTextProps={
          {
            "data-test-id": testIds.errorText,
          } as HTMLAttributes<HTMLDivElement>
        }
        hint={hint}
        hintProps={
          {
            "data-test-id": testIds.hint,
          } as HTMLAttributes<HTMLDivElement>
        }
        inputProps={
          {
            "data-test-id": testIds.input,
          } as HTMLAttributes<HTMLTextAreaElement>
        }
        label={label}
        labelProps={
          {
            "data-test-id": testIds.label,
          } as HTMLAttributes<HTMLLabelElement>
        }
        maxLength={maxLength}
        placeholder={placeholder}
      />
    </div>
  )
}

export function CompositeTextArea(
  props: TextAreaRootProps & TestTextAreaProps,
) {
  const {counter, errorText, hint, label, maxLength, placeholder, ...rest} =
    props

  return (
    <div>
      <button data-test-id={testIds.focusTarget} type="button">
        Focus target
      </button>
      <TextArea.Root
        {...rest}
        data-test-id={testIds.root}
        maxLength={maxLength}
      >
        {label && (
          <TextArea.Label data-test-id={testIds.label}>{label}</TextArea.Label>
        )}
        {(counter ?? maxLength !== undefined) && (
          <TextArea.Counter data-test-id={testIds.counter} />
        )}
        <TextArea.Input
          data-test-id={testIds.input}
          maxLength={maxLength}
          placeholder={placeholder}
        />
        {hint && (
          <TextArea.Hint data-test-id={testIds.hint}>{hint}</TextArea.Hint>
        )}
        {errorText && (
          <TextArea.ErrorText data-test-id={testIds.errorText}>
            {errorText}
          </TextArea.ErrorText>
        )}
      </TextArea.Root>
    </div>
  )
}
