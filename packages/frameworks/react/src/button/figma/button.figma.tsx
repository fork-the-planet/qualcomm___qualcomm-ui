// @ts-nocheck

// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import {Button} from "@qualcomm-ui/react/button"

const BUTTON_URL = "<FIGMA_COMPONENTS_BASE>?node-id=3571-1400"
const COMPACT_BUTTON_URL = "<FIGMA_COMPONENTS_BASE>?node-id=16548-1775"

const sharedProps = {
  disabled: figma.enum("state", {
    disabled: true,
  }),
  emphasis: figma.enum("emphasis", {
    "black-persistent": "black-persistent",
    danger: "danger",
    primary: "primary",
    "white-persistent": "white-persistent",
  }),
  label: figma.string("label"),
  size: figma.enum("size", {
    large: "lg",
    small: "sm",
  }),
  variant: figma.enum("variant", {
    ghost: "ghost",
    outline: "outline",
  }),
}

// Main Button
figma.connect(Button, BUTTON_URL, {
  example: ({label, ...props}) => <Button {...props}>{label}</Button>,
  props: {
    ...sharedProps,
    startIcon: figma.enum("icon", {
      start: figma.instance("iconXxs"),
    }),
  },
  variant: {icon: "start"},
})

figma.connect(Button, BUTTON_URL, {
  example: ({label, ...props}) => <Button {...props}>{label}</Button>,
  props: {
    ...sharedProps,
    endIcon: figma.enum("icon", {
      end: figma.instance("iconXxs"),
    }),
  },
  variant: {icon: "end"},
})

figma.connect(Button, BUTTON_URL, {
  example: ({icon, ...props}) => <Button {...props}>{icon}</Button>,
  props: {
    ...sharedProps,
    icon: figma.instance("iconXxs"),
  },
  variant: {icon: "only"},
})

figma.connect(Button, BUTTON_URL, {
  example: ({label, ...props}) => <Button {...props}>{label}</Button>,
  props: sharedProps,
  variant: {icon: "none"},
})

// Compact Button
figma.connect(Button, COMPACT_BUTTON_URL, {
  example: ({label, ...props}) => (
    <Button density="compact" {...props}>
      {label}
    </Button>
  ),
  props: {
    ...sharedProps,
    startIcon: figma.enum("icon", {
      start: figma.instance("iconXxs"),
    }),
  },
  variant: {icon: "start"},
})

figma.connect(Button, COMPACT_BUTTON_URL, {
  example: ({label, ...props}) => (
    <Button density="compact" {...props}>
      {label}
    </Button>
  ),
  props: {
    ...sharedProps,
    endIcon: figma.enum("icon", {
      end: figma.instance("iconXxs"),
    }),
  },
  variant: {icon: "end"},
})

figma.connect(Button, COMPACT_BUTTON_URL, {
  example: ({icon, ...props}) => (
    <Button density="compact" {...props}>
      {icon}
    </Button>
  ),
  props: {
    ...sharedProps,
    icon: figma.instance("iconXxs"),
  },
  variant: {icon: "only"},
})

figma.connect(Button, COMPACT_BUTTON_URL, {
  example: ({label, ...props}) => (
    <Button density="compact" {...props}>
      {label}
    </Button>
  ),
  props: sharedProps,
  variant: {icon: "none"},
})
