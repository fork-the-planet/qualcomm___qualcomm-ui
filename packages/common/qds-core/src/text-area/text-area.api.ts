// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {textAreaClasses} from "./text-area.classes.js"
import type {
  QdsTextAreaApi,
  QdsTextAreaApiProps,
  QdsTextAreaCounterBindings,
  QdsTextAreaErrorTextBindings,
  QdsTextAreaHintBindings,
  QdsTextAreaInputBindings,
  QdsTextAreaLabelBindings,
  QdsTextAreaRequiredIndicatorBindings,
  QdsTextAreaRootBindings,
} from "./text-area.types.js"

export function createQdsTextAreaApi(
  props: QdsTextAreaApiProps,
  normalize: PropNormalizer,
): QdsTextAreaApi {
  const size = props.size || "md"

  return {
    size,

    // group: prop getters
    getCounterBindings(): QdsTextAreaCounterBindings {
      return normalize.element({
        className: textAreaClasses.counter,
        "data-size": size,
      })
    },
    getErrorTextBindings(): QdsTextAreaErrorTextBindings {
      return normalize.element({
        className: textAreaClasses.errorText,
      })
    },
    getHintBindings(): QdsTextAreaHintBindings {
      return normalize.element({
        className: textAreaClasses.hint,
      })
    },
    getInputBindings(): QdsTextAreaInputBindings {
      return normalize.input({
        className: textAreaClasses.input,
        "data-size": size,
      })
    },
    getLabelBindings(): QdsTextAreaLabelBindings {
      return normalize.label({
        className: textAreaClasses.label,
        "data-size": size,
      })
    },
    getRequiredIndicatorBindings(): QdsTextAreaRequiredIndicatorBindings {
      return normalize.element({
        className: textAreaClasses.requiredIndicator,
      })
    },
    getRootBindings(): QdsTextAreaRootBindings {
      return normalize.element({
        className: textAreaClasses.root,
        "data-size": size,
      })
    },
  }
}
