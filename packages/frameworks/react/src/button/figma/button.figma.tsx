// @ts-nocheck

// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import {Button, IconButton} from "@qualcomm-ui/react/button"

const BUTTON_URL = "<FIGMA_COMPONENTS_BASE>?node-id=3571-1400"
const COMPACT_BUTTON_URL = "<FIGMA_COMPONENTS_BASE>?node-id=16548-1775"
const ICON_BUTTON_URL = "<FIGMA_COMPONENTS_BASE>?node-id=22444-21587"
const COMPACT_ICON_BUTTON_URL = "<FIGMA_COMPONENTS_BASE>?node-id=22861-1682"

const baseProps = {
  disabled: figma.enum("state", {
    disabled: true,
  }),
  emphasis: figma.enum("emphasis", {
    "black-persistent": "black-persistent",
    danger: "danger",
    primary: "primary",
    "white-persistent": "white-persistent",
  }),
  size: figma.enum("size", {
    large: "lg",
    small: "sm",
  }),
  variant: figma.enum("variant", {
    ghost: "ghost",
    outline: "outline",
  }),
}

const sharedButtonProps = {
  ...baseProps,
  label: figma.string("label"),
}

const sharedIconButtonProps = {
  ...baseProps,
}

// Main Button
figma.connect(Button, BUTTON_URL, {
  example: ({label, ...props}) => <Button {...props}>{label}</Button>,
  props: {
    ...sharedButtonProps,
    startIcon: figma.enum("icon", {
      start: figma.instance("iconXxs"),
    }),
  },
  variant: {icon: "start"},
})

figma.connect(Button, BUTTON_URL, {
  example: ({label, ...props}) => <Button {...props}>{label}</Button>,
  props: {
    ...sharedButtonProps,
    endIcon: figma.enum("icon", {
      end: figma.instance("iconXxs"),
    }),
  },
  variant: {icon: "end"},
})

figma.connect(Button, BUTTON_URL, {
  example: ({label, ...props}) => <Button {...props}>{label}</Button>,
  props: sharedButtonProps,
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
    ...sharedButtonProps,
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
    ...sharedButtonProps,
    endIcon: figma.enum("icon", {
      end: figma.instance("iconXxs"),
    }),
  },
  variant: {icon: "end"},
})

figma.connect(Button, COMPACT_BUTTON_URL, {
  example: ({label, ...props}) => (
    <Button density="compact" {...props}>
      {label}
    </Button>
  ),
  props: sharedButtonProps,
  variant: {icon: "none"},
})

// Icon Button
figma.connect(IconButton, ICON_BUTTON_URL, {
  example: (props) => <IconButton {...props} />,
  props: {...sharedIconButtonProps, icon: figma.instance("iconXs")},
  variant: {
    size: "small",
  },
})

figma.connect(IconButton, ICON_BUTTON_URL, {
  example: (props) => <IconButton {...props} />,
  props: {...sharedIconButtonProps, icon: figma.instance("iconSm")},
  variant: {
    size: "medium",
  },
})

figma.connect(IconButton, ICON_BUTTON_URL, {
  example: (props) => <IconButton {...props} />,
  props: {...sharedIconButtonProps, icon: figma.instance("iconMd")},
  variant: {
    size: "large",
  },
})

figma.connect(IconButton, COMPACT_ICON_BUTTON_URL, {
  example: (props) => <IconButton density="compact" {...props} />,
  props: {...sharedIconButtonProps, icon: figma.instance("iconXxs")},
  variant: {
    size: "small",
  },
})

figma.connect(IconButton, COMPACT_ICON_BUTTON_URL, {
  example: (props) => <IconButton density="compact" {...props} />,
  props: {...sharedIconButtonProps, icon: figma.instance("iconXs")},
  variant: {
    size: "medium",
  },
})

figma.connect(IconButton, COMPACT_ICON_BUTTON_URL, {
  example: (props) => <IconButton density="compact" {...props} />,
  props: {...sharedIconButtonProps, icon: figma.instance("iconXs")},
  variant: {
    size: "large",
  },
})
