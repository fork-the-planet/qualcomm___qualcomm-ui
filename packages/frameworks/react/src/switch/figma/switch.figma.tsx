// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import {Switch} from "@qualcomm-ui/react/switch"

const sharedProps = {
  defaultChecked: figma.enum("variant", {
    checked: true,
    "invalid-checked": true,
  }),
  disabled: figma.enum("state", {
    disabled: true,
  }),
  invalid: figma.enum("variant", {
    "invalid-checked": true,
    "invalid-unchecked": true,
  }),
  size: figma.enum("size", {
    sm: "sm",
  }),
}

// Basic Switch (no label)
figma.connect(Switch, "<FIGMA_COMPONENTS_BASE>?node-id=12609-520", {
  example: (props) => <Switch {...props} />,
  props: sharedProps,
})

// Switch with label
figma.connect(Switch, "<FIGMA_COMPONENTS_BASE>?node-id=2270-5170", {
  example: ({label, ...props}) => <Switch label={label} {...props} />,
  props: {
    ...sharedProps,
    errorText: figma.string("errorText"),
    label: figma.boolean("label", {
      true: figma.string("labelText"),
    }),
  },
})
