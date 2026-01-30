// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import type {QdsRadioSize} from "@qualcomm-ui/qds-core/radio"
import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

const sharedRadioProps = {
  defaultChecked: figma.enum("variant", {
    checked: true,
    "invalid-checked": true,
  }),
  disabled: figma.enum("state", {
    disabled: true,
  }),
}

// radio with label
figma.connect(Radio, "<FIGMA_COMPONENTS_BASE>?node-id=2270-3948", {
  example: ({labelText, hint, ...props}) => {
    return <Radio label={labelText} hint={hint} {...props} />
  },
  props: {
    ...sharedRadioProps,
    hint: figma.boolean("hint", {
      true: figma.string("hintText"),
      false: undefined,
    }),
    labelText: figma.string("labelText"),
  },
})

// radio without label
figma.connect(Radio, "<FIGMA_COMPONENTS_BASE>?node-id=12607-174277", {
  example: (props) => {
    return <Radio {...props} />
  },
  props: {
    ...sharedRadioProps,
  },
})

const sharedRadioGroupProps = {
  children: figma.children("Radio with label"),
  indented: figma.boolean("indented"),
  orientation: figma.enum("orientation", {
    horizontal: "horizontal",
  }),
  size: figma.enum<QdsRadioSize>("size", {
    lg: "lg",
    sm: "sm",
  }),
}

// radio-group with label
figma.connect(RadioGroup.Root, "<FIGMA_COMPONENTS_BASE>?node-id=2270-4637", {
  example: ({children, indented, label, size, ...props}) => {
    return (
      <RadioGroup.Root indented={indented} size={size} {...props}>
        <RadioGroup.Label>{label}</RadioGroup.Label>
        <RadioGroup.Items>
          {/* Each <Radio> requires a value prop not shown here */}
          {children}
        </RadioGroup.Items>
      </RadioGroup.Root>
    )
  },
  props: {
    ...sharedRadioGroupProps,
    label: figma.string("labelText"),
  },
  variant: {
    label: true,
  },
})

// radio-group without label
figma.connect(RadioGroup.Root, "<FIGMA_COMPONENTS_BASE>?node-id=2270-4637", {
  example: ({children, indented, size, ...props}) => {
    return (
      <RadioGroup.Root indented={indented} size={size} {...props}>
        <RadioGroup.Items>
          {/* Each <Radio> requires a value prop not shown here */}
          {children}
        </RadioGroup.Items>
      </RadioGroup.Root>
    )
  },
  props: {
    ...sharedRadioGroupProps,
  },
  variant: {
    label: false,
  },
})
