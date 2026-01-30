// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"
import {Layers} from "lucide-react"

import {comboboxCollection} from "@qualcomm-ui/core/combobox"
import {Combobox} from "@qualcomm-ui/react/combobox"

const sharedProps = {
  disabled: figma.enum("state", {
    disabled: true,
  }),
  errorText: figma.enum("state", {
    invalid: "Error message",
    "invalid-focus": "Error message",
    "invalid-open": "Error message",
  }),
  hint: figma.boolean("hint", {
    true: figma.string("hintText"),
  }),
  icon: figma.boolean("startIcon", {
    true: <Layers />,
  }),
  invalid: figma.enum("state", {
    invalid: true,
    "invalid-focus": true,
    "invalid-open": true,
  }),
  readOnly: figma.enum("state", {
    "read-only": true,
  }),
  required: figma.boolean("required"),
  size: figma.enum("size", {
    lg: "lg",
    sm: "sm",
  }),
}

// With label
figma.connect(Combobox, "<FIGMA_COMPONENTS_BASE>?node-id=13121-11284&", {
  example: ({hint, label, ...props}) => (
    <Combobox
      collection={comboboxCollection({
        items: ["Option 1", "Option 2", "Option 3"],
      })}
      hint={hint}
      label={label}
      {...props}
    />
  ),
  props: {
    ...sharedProps,
    label: figma.boolean("label", {
      true: figma.string("labelText"),
    }),
  },
  variant: {
    label: true,
  },
})

// Without label - use aria-label on inputProps for accessibility
figma.connect(Combobox, "<FIGMA_COMPONENTS_BASE>?node-id=13121-11284", {
  example: ({hint, ...props}) => (
    <Combobox
      collection={comboboxCollection({
        items: ["Option 1", "Option 2", "Option 3"],
      })}
      hint={hint}
      inputProps={{"aria-label": "Select an option"}}
      {...props}
    />
  ),
  props: sharedProps,
  variant: {
    label: false,
  },
})
