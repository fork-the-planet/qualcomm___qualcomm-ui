// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import type {
  QdsProgressEmphasis,
  QdsProgressLabelOrientation,
  QdsProgressSize,
} from "@qualcomm-ui/qds-core/progress"
import {Progress} from "@qualcomm-ui/react/progress"

const sharedProps = {
  disabled: figma.enum("state", {
    disabled: true,
  }),
  emphasis: figma.enum<QdsProgressEmphasis>("emphasis", {
    neutral: "neutral",
  }),
  errorText: figma.string("errorText"),
  hint: figma.string("hintText"),
  invalid: figma.enum("state", {
    invalid: true,
  }),
  label: figma.boolean("label", {
    true: figma.string("labelText"),
  }),
  labelOrientation: figma.enum<QdsProgressLabelOrientation>("labelPosition", {
    side: "side",
  }),
  size: figma.enum<QdsProgressSize>("size", {
    lg: "lg",
    sm: "sm",
  }),
  valueText: figma.boolean("percentage", {
    false: undefined,
    true: "25%",
  }),
}

// Determinate progress (indeterminate=False)
figma.connect(Progress, "<FIGMA_COMPONENTS_BASE>?node-id=4402-120", {
  example: (props) => <Progress value={25} {...props} />,
  props: sharedProps,
  variant: {indeterminate: "False"},
})

// Indeterminate progress (indeterminate=True)
figma.connect(Progress, "<FIGMA_COMPONENTS_BASE>?node-id=4402-120", {
  example: ({valueText, ...props}) => <Progress {...props} />,
  props: sharedProps,
  variant: {indeterminate: "True"},
})
