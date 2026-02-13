// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import type {
  QdsProgressRingEmphasis,
  QdsProgressRingSize,
} from "@qualcomm-ui/qds-core/progress-ring"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"

const sharedProps = {
  emphasis: figma.enum<QdsProgressRingEmphasis>("emphasis", {
    neutral: "neutral",
  }),
  errorText: figma.boolean("hint", {
    true: figma.string("errorText"),
  }),
  invalid: figma.enum("state", {
    invalid: true,
  }),
  label: figma.boolean("hint", {
    true: figma.string("hintText"),
  }),
  size: figma.enum<QdsProgressRingSize>("size", {
    lg: "lg",
    sm: "sm",
    xl: "xl",
    xs: "xs",
    xxs: "xxs",
  }),
}

// Determinate progress ring (indeterminate=False)
figma.connect(ProgressRing, "<FIGMA_COMPONENTS_BASE>?node-id=6622-615", {
  example: (props) => <ProgressRing value={25} {...props} />,
  props: {
    ...sharedProps,
    valueText: figma.boolean("percentage", {
      false: undefined,
      true: "25%",
    }),
  },
  variant: {indeterminate: "false"},
})

// Indeterminate progress ring (indeterminate=true)
figma.connect(ProgressRing, "<FIGMA_COMPONENTS_BASE>?node-id=6622-615", {
  example: (props) => <ProgressRing {...props} />,
  props: sharedProps,
  variant: {indeterminate: "true"},
})
