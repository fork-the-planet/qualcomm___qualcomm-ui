// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import {ButtonGroup} from "@qualcomm-ui/react/button"

figma.connect(ButtonGroup, "<FIGMA_COMPONENTS_BASE>?node-id=7191%3A1090", {
  example: (props) => {
    return (
      <ButtonGroup layout={props.layout} size={props.size}>
        {props.children}
      </ButtonGroup>
    )
  },
  props: {
    layout: figma.enum("buttonWidth", {
      fill: "fill",
    }),
    size: figma.enum("size", {
      lg: "lg",
      sm: "sm",
    }),
    children: figma.children("*"),
  },
})
