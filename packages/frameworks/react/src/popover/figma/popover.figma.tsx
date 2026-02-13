// @ts-nocheck

// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import type {QdsPopoverEmphasis} from "@qualcomm-ui/qds-core/popover"
import {Button} from "@qualcomm-ui/react/button"
import {Popover} from "@qualcomm-ui/react/popover"

const FIGMA_URL = "<FIGMA_COMPONENTS_BASE>?node-id=5951-1058"

figma.connect(Popover, FIGMA_URL, {
  example: ({actionItems, content, emphasis, positioning}) => (
    <Popover
      description={content.body}
      emphasis={emphasis}
      label={content.label}
      positioning={positioning.placement}
      trigger={<Button emphasis="primary">Show Popover</Button>}
    >
      {actionItems.button1}
      {actionItems.button2}
    </Popover>
  ),
  props: {
    actionItems: figma.nestedProps("_Popover content", {
      button1: figma.boolean("actionItems", {
        true: (
          <Button emphasis="neutral" variant="outline">
            Button
          </Button>
        ),
      }),
      button2: figma.boolean("actionItems", {
        true: <Button emphasis="primary">Button</Button>,
      }),
    }),
    content: figma.nestedProps("_Popover content", {
      body: figma.string("body"),
      label: figma.boolean("heading", {
        true: figma.string("headingText"),
      }),
    }),
    emphasis: figma.enum<QdsPopoverEmphasis>("emphasis", {
      brand: "brand",
    }),
    positioning: figma.nestedProps("_Popover pointer placement", {
      placement: figma.enum("position", {
        "bottom-left": {placement: "bottom-start"},
        "bottom-middle": {placement: "bottom"},
        "bottom-right": {placement: "bottom-end"},
        "left-bottom": {placement: "left-end"},
        "left-middle": {placement: "left"},
        "left-top": {placement: "left-start"},
        "right-bottom": {placement: "right-end"},
        "right-middle": {placement: "right"},
        "right-top": {placement: "right-start"},
        "top-left": {placement: "top-start"},
        "top-middle": {placement: "top"},
        "top-right": {placement: "top-end"},
      }),
    }),
  },
})
