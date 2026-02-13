// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import {TextInput} from "@qualcomm-ui/react/text-input"

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
  placeholder: figma.string("holderText"),
  readOnly: figma.enum("state", {
    "read-only": true,
  }),
  required: figma.boolean("required"),
  size: figma.enum("size", {
    lg: "lg",
    sm: "sm",
  }),
}

figma.connect(TextInput, "<FIGMA_COMPONENTS_BASE>?node-id=4227-2418", {
  example: ({hint, label, ...props}) => (
    <TextInput hint={hint} label={label} {...props} />
  ),
  props: {
    ...sharedProps,
    endIcon: figma.instance("iconRxs"),
    startIcon: figma.instance("iconLxs"),
  },
})

figma.connect(TextInput, "<FIGMA_COMPONENTS_BASE>?node-id=4227-2418", {
  example: ({hint, label, ...props}) => (
    <TextInput hint={hint} label={label} {...props} />
  ),
  props: {
    ...sharedProps,
    endIcon: figma.instance("iconRsm"),
    startIcon: figma.instance("iconLsm"),
  },
  variant: {
    size: "lg",
  },
})
