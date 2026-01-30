// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"
import {Layers} from "lucide-react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Select} from "@qualcomm-ui/react/select"

const sharedProps = {
  disabled: figma.enum("state", {
    disabled: true,
  }),
  errorText: figma.string("errorText"),
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
figma.connect(Select, "<FIGMA_COMPONENTS_BASE>?node-id=6831-5712", {
  example: ({hint, label, ...props}) => (
    <Select
      collection={selectCollection({
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

// Without label - use aria-label on controlProps for accessibility
figma.connect(Select, "<FIGMA_COMPONENTS_BASE>?node-id=6831-5712", {
  example: ({hint, ...props}) => (
    <Select
      collection={selectCollection({
        items: ["Option 1", "Option 2", "Option 3"],
      })}
      controlProps={{"aria-label": "Select an option"}}
      hint={hint}
      {...props}
    />
  ),
  props: sharedProps,
  variant: {
    label: false,
  },
})
