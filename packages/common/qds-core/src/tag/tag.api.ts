// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {tagAnatomy} from "./tag.anatomy"
import {tagClasses} from "./tag.classes"
import type {
  QdsTagApi,
  QdsTagApiProps,
  QdsTagDismissButtonBindings,
  QdsTagEndIconBindings,
  QdsTagRootBindings,
  QdsTagStartIconBindings,
} from "./tag.types"

const parts = tagAnatomy.parts

export function createQdsTagApi(
  props: QdsTagApiProps & {selected?: boolean | undefined},
  normalize: PropNormalizer,
): QdsTagApi {
  const size = props.size || "md"
  const selected = props.variant === "selectable" && props.selected

  function isInteractiveVariant(): boolean {
    return props.variant === "link" || props.variant === "selectable"
  }

  const commonBindings = {
    ...parts.root,
    className: tagClasses.root,
    "data-disabled": booleanDataAttr(props.disabled),
    "data-emphasis": props.emphasis || "outline-brand",
    "data-selected": booleanDataAttr(selected),
    "data-shape": props.shape || props.radius || "square",
    "data-size": size,
    "data-variant": props.variant,
  }

  return {
    getDismissButtonBindings(): QdsTagDismissButtonBindings {
      return normalize.button({
        ...parts.dismissButton,
        "aria-label": "Dismiss",
        className: tagClasses.dismissButton,
        "data-disabled": booleanDataAttr(props.disabled),
        "data-size": size,
        disabled: props.disabled,
        type: "button",
      })
    },
    getEndIconBindings(): QdsTagEndIconBindings {
      return normalize.element({
        ...parts.endIcon,
        className: tagClasses.icon,
      })
    },
    getRootBindings(): QdsTagRootBindings {
      if (!isInteractiveVariant()) {
        return normalize.element(commonBindings)
      }
      return normalize.button({
        ...commonBindings,
        "aria-pressed":
          props.variant === "selectable"
            ? booleanAriaAttr(selected)
            : undefined,
        disabled: props.disabled,
      })
    },
    getStartIconBindings(): QdsTagStartIconBindings {
      return normalize.element({
        ...parts.startIcon,
        className: tagClasses.icon,
      })
    },
    isInteractiveVariant,
  }
}
