// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {textAreaClasses} from "./text-area.classes.js"

export type QdsTextAreaSize = "sm" | "md" | "lg"

export interface QdsTextAreaApiProps {
  /**
   * The size of the textarea and its elements. Governs properties like font size,
   * and item padding.
   *
   * @default 'md'
   */
  size?: QdsTextAreaSize
}

type TextAreaClasses = typeof textAreaClasses

export interface QdsTextAreaRootBindings {
  className: TextAreaClasses["root"]
  "data-size": QdsTextAreaSize
}

export interface QdsTextAreaCounterBindings {
  className: TextAreaClasses["counter"]
  "data-size": QdsTextAreaSize
}

export interface QdsTextAreaLabelBindings {
  className: TextAreaClasses["label"]
  "data-size": QdsTextAreaSize
}

export interface QdsTextAreaInputBindings {
  className: TextAreaClasses["input"]
  "data-size": QdsTextAreaSize
}

export interface QdsTextAreaHintBindings {
  className: TextAreaClasses["hint"]
}

export interface QdsTextAreaErrorTextBindings {
  className: TextAreaClasses["errorText"]
}

export interface QdsTextAreaRequiredIndicatorBindings {
  className: TextAreaClasses["requiredIndicator"]
}

export interface QdsTextAreaApi {
  size: QdsTextAreaSize

  // group: prop getters
  getCounterBindings(): QdsTextAreaCounterBindings
  getErrorTextBindings(): QdsTextAreaErrorTextBindings
  getHintBindings(): QdsTextAreaHintBindings
  getInputBindings(): QdsTextAreaInputBindings
  getLabelBindings(): QdsTextAreaLabelBindings
  getRequiredIndicatorBindings(): QdsTextAreaRequiredIndicatorBindings
  getRootBindings(): QdsTextAreaRootBindings
}
