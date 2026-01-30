// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import type {QdsInputSize} from "@qualcomm-ui/qds-core/input"
import {NumberInput} from "@qualcomm-ui/react/number-input"

const sharedProps = {
  defaultValue: figma.boolean("filled", {
    true: figma.string("inputText"),
  }),
  disabled: figma.enum("state", {
    disabled: true,
  }),
  errorText: figma.string("errorText"),
  hint: figma.boolean("hint", {
    true: figma.string("hintText"),
  }),
  invalid: figma.enum("state", {
    invalid: true,
    "invalid-focus": true,
  }),
  label: figma.boolean("label", {
    true: figma.string("labelText"),
  }),
  readOnly: figma.enum("state", {
    "read-only": true,
  }),
  required: figma.boolean("required"),
  size: figma.enum<QdsInputSize>("size", {
    lg: "lg",
    sm: "sm",
  }),
}

figma.connect(NumberInput, "<FIGMA_COMPONENTS_BASE>?node-id=4771-2328", {
  example: ({hint, label, ...props}) => (
    <NumberInput hint={hint} label={label} {...props} />
  ),
  props: sharedProps,
})
