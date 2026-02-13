// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import type {QdsDividerVariant} from "@qualcomm-ui/qds-core/divider"
import {Divider} from "@qualcomm-ui/react/divider"

const variantProp = {
  variant: figma.enum<QdsDividerVariant>("variant", {
    strong: "strong",
    subtle: "subtle",
  }),
}

// Horizontal Divider
figma.connect(Divider, "<FIGMA_COMPONENTS_BASE>?node-id=5578-13", {
  example: (props) => <Divider {...props} />,
  props: variantProp,
})

// Vertical Divider
figma.connect(Divider, "<FIGMA_COMPONENTS_BASE>?node-id=13492-10", {
  example: (props) => <Divider orientation="vertical" {...props} />,
  props: variantProp,
})
