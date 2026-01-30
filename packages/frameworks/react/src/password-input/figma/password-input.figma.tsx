// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// @ts-nocheck
import figma from "@figma/code-connect"

import type {QdsInputSize} from "@qualcomm-ui/qds-core/input"
import {PasswordInput} from "@qualcomm-ui/react/password-input"

const sharedProps = {
  defaultValue: figma.boolean("filled", {
    true: figma.string("passwordText"),
  }),
  defaultVisible: figma.enum("password", {
    show: true,
  }),
  disabled: figma.enum("state", {
    disabled: true,
  }),
  errorText: figma.enum("state", {
    invalid: "Error message",
    "invalid-focus": "Error message",
  }),
  hint: figma.boolean("hint", {
    false: undefined,
    true: figma.string("hintText"),
  }),
  invalid: figma.enum("state", {
    invalid: true,
    "invalid-focus": true,
  }),
  label: figma.boolean("label", {
    false: undefined,
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

figma.connect(PasswordInput, "<FIGMA_COMPONENTS_BASE>?node-id=5307-3964", {
  example: ({hint, label, startIcon, ...props}) => (
    <PasswordInput hint={hint} label={label} startIcon={startIcon} {...props} />
  ),
  props: {
    ...sharedProps,
    startIcon: figma.boolean("startIcon", {
      true: "KeyRound",
    }),
  },
})
