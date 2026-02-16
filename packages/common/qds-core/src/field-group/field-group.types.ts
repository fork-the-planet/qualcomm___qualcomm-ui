// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {fieldGroupClasses} from "./field-group.classes"

export type FieldGroupSize = "sm" | "md" | "lg"

export type FieldGroupOrientation = "vertical" | "horizontal"

export interface QdsFieldGroupApiProps {
  /**
   * Adds padding at the start of the items container.
   */
  indented?: boolean

  /**
   * Marks the group as invalid.
   */
  invalid?: boolean

  /**
   * Layout direction for items.
   * @default 'vertical'
   */
  orientation?: FieldGroupOrientation

  /**
   * The size of the group items.
   * @default 'md'
   */
  size?: FieldGroupSize
}

type FieldGroupClasses = typeof fieldGroupClasses

interface CommonBindings {
  "data-scope": "field-group"
}

export interface QdsFieldGroupRootBindings extends CommonBindings {
  className: FieldGroupClasses["root"]
  "data-invalid": BooleanDataAttr
  "data-part": "root"
}

export interface QdsFieldGroupLabelBindings extends CommonBindings {
  className: FieldGroupClasses["label"]
  "data-part": "label"
}

export interface QdsFieldGroupItemsBindings extends CommonBindings {
  className: FieldGroupClasses["items"]
  "data-indented": BooleanDataAttr
  "data-orientation": FieldGroupOrientation
  "data-part": "items"
  "data-size": FieldGroupSize
}

export interface QdsFieldGroupHintBindings extends CommonBindings {
  className: FieldGroupClasses["hint"]
  "data-part": "hint"
}

export interface QdsFieldGroupErrorTextBindings extends CommonBindings {
  className: FieldGroupClasses["errorText"]
  "data-part": "error-text"
}

export interface QdsFieldGroupApi {
  getErrorTextBindings(): QdsFieldGroupErrorTextBindings
  getHintBindings(): QdsFieldGroupHintBindings
  getItemsBindings(): QdsFieldGroupItemsBindings
  getLabelBindings(): QdsFieldGroupLabelBindings
  getRootBindings(): QdsFieldGroupRootBindings

  indented: boolean
  invalid: boolean
  orientation: FieldGroupOrientation
  size: FieldGroupSize
}
