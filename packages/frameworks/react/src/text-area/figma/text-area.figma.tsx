// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import {TextArea} from "@qualcomm-ui/react/text-area"

const sharedProps = {
  counter: figma.boolean("count"),
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
  maxLength: figma.boolean("count", {
    true: 100,
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

figma.connect(TextArea, "<FIGMA_COMPONENTS_BASE>?node-id=4587-9674", {
  example: ({hint, label, ...props}) => (
    <TextArea hint={hint} label={label} {...props} />
  ),
  props: sharedProps,
})
