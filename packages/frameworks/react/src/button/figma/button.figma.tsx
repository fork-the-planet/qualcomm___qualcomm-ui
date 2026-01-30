// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import {Button} from "@qualcomm-ui/react/button"

const sharedProps = {
  disabled: figma.enum("state", {
    disabled: true,
  }),
  emphasis: figma.enum("emphasis", {
    "black-persistent": "black-persistent",
    danger: "danger",
    neutral: "neutral",
    primary: "primary",
    "white-persistent": "white-persistent",
  }),
  variant: figma.enum("variant", {
    filled: "fill",
    ghost: "ghost",
    outline: "outline",
  }),
}

const sizeProp = {
  size: figma.enum("size", {
    lg: "lg",
    md: "md",
    sm: "sm",
  }),
}

// TODO: solve these issues: https://qualcomm-confluence.atlassian.net/wiki/spaces/SAGAUX/pages/2869087007/QDS+Figma+Code+Connect+discussion
figma.connect(Button, "<FIGMA_COMPONENTS_BASE>?node-id=3571%3A1400", {
  example: (props) => {
    return (
      <Button
        disabled={props.disabled}
        emphasis={props.emphasis}
        size={props.nested.size}
        variant={props.variant}
      >
        {props.nested.label}
      </Button>
    )
  },
  props: {
    ...sharedProps,
    nested: figma.nestedProps("_Button Foundation", {
      ...sizeProp,
      icon: figma.enum("icon", {
        end: "end",
        none: "none",
        only: "only",
        start: "start",
      }),
      iconLg: figma.instance("iconLg"),
      iconMd: figma.instance("iconMd"),
      iconSm: figma.instance("iconSm"),
      label: figma.instance("label"),
    }),
  },
})
