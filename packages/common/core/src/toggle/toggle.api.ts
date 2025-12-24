// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import type {ToggleApi, ToggleSchema} from "./toggle.types"

export function createToggleApi(
  machine: Machine<ToggleSchema>,
  normalize: PropNormalizer,
): ToggleApi {
  const {context, prop, send} = machine
  const pressed = context.get("pressed")
  const dir = prop("dir")

  return {
    disabled: !!prop("disabled"),
    pressed,
    setPressed(value) {
      send({type: "PRESS.SET", value})
    },

    // group: bindings
    getIndicatorBindings() {
      return normalize.element({
        "data-disabled": booleanDataAttr(prop("disabled")),
        "data-part": "indicator",
        "data-pressed": booleanDataAttr(pressed),
        "data-scope": "toggle",
        "data-state": pressed ? "on" : "off",
        dir,
      })
    },

    getRootBindings() {
      return normalize.element({
        "aria-pressed": booleanAriaAttr(pressed),
        "data-disabled": booleanDataAttr(prop("disabled")),
        "data-part": "root",
        "data-pressed": booleanDataAttr(pressed),
        "data-scope": "toggle",
        "data-state": pressed ? "on" : "off",
        dir,
        disabled: prop("disabled"),
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (prop("disabled")) {
            return
          }
          send({type: "PRESS.TOGGLE"})
        },
        type: "button",
      })
    },
  }
}
