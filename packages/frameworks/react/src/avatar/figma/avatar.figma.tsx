// @ts-nocheck

// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"
import {User} from "lucide-react"

import type {
  QdsAvatarEmphasis,
  QdsAvatarSize,
} from "@qualcomm-ui/qds-core/avatar"
import {Avatar} from "@qualcomm-ui/react/avatar"

const statusProps = {
  status: figma.boolean("status", {
    true: "active",
  }),
  statusIndicator: figma.boolean("status", {
    true: <Avatar.Status />,
  }),
}

const sharedProps = {
  ...statusProps,
  emphasis: figma.enum<QdsAvatarEmphasis>("emphasis", {
    brand: "brand",
    "high-contrast": "contrast",
  }),
  size: figma.enum<QdsAvatarSize>("size", {
    lg: "lg",
    sm: "sm",
    xl: "xl",
    xs: "xs",
  }),
}

// Icon variant
figma.connect(Avatar, "<FIGMA_COMPONENTS_BASE>?node-id=17804-5308", {
  example: ({emphasis, size, status, statusIndicator}) => (
    <Avatar.Root emphasis={emphasis} size={size} status={status}>
      <Avatar.Content icon={User} />
      {statusIndicator}
    </Avatar.Root>
  ),
  props: sharedProps,
})

// Initial variant
figma.connect(Avatar, "<FIGMA_COMPONENTS_BASE>?node-id=17804-5517", {
  example: ({emphasis, initialText, size, status, statusIndicator}) => (
    <Avatar.Root emphasis={emphasis} size={size} status={status}>
      <Avatar.Content>{initialText}</Avatar.Content>
      {statusIndicator}
    </Avatar.Root>
  ),
  props: {
    ...sharedProps,
    initialText: figma.string("initialText"),
  },
})

// Image variant
figma.connect(Avatar, "<FIGMA_COMPONENTS_BASE>?node-id=17804-5726", {
  example: ({size, status, statusIndicator}) => (
    <Avatar.Root size={size} status={status}>
      <Avatar.Image alt="User avatar" src="path/to/image.jpg" />
      {statusIndicator}
    </Avatar.Root>
  ),
  props: {
    size: figma.enum<QdsAvatarSize>("size", {
      lg: "lg",
      sm: "sm",
      xl: "xl",
      xs: "xs",
    }),
    ...statusProps,
  },
})

// Main Example - Icon variant
figma.connect(Avatar, "<FIGMA_COMPONENTS_BASE>?node-id=17809-2448", {
  example: ({nested}) => (
    <Avatar.Root
      emphasis={nested.emphasis}
      size={nested.size}
      status={nested.status}
    >
      <Avatar.Content icon={User} />
      {nested.statusIndicator}
    </Avatar.Root>
  ),
  props: {
    nested: figma.nestedProps("Avatar icon options", {
      ...sharedProps,
    }),
  },
  variant: {variant: "icon"},
})

// Main Example - Initial variant
figma.connect(Avatar, "<FIGMA_COMPONENTS_BASE>?node-id=17809-2448", {
  example: ({nested}) => (
    <Avatar.Root
      emphasis={nested.emphasis}
      size={nested.size}
      status={nested.status}
    >
      <Avatar.Content>{nested.initialText}</Avatar.Content>
      {nested.statusIndicator}
    </Avatar.Root>
  ),
  props: {
    nested: figma.nestedProps("Avatar initial options", {
      initialText: figma.string("initialText"),
      ...sharedProps,
    }),
  },
  variant: {variant: "initial"},
})

// Main Example - Image variant
figma.connect(Avatar, "<FIGMA_COMPONENTS_BASE>?node-id=17809-2448", {
  example: ({nested}) => (
    <Avatar.Root size={nested.size} status={nested.status}>
      <Avatar.Image alt="User avatar" src="path/to/image.jpg" />
      {nested.statusIndicator}
    </Avatar.Root>
  ),
  props: {
    nested: figma.nestedProps("Avatar image options", {
      size: figma.enum<QdsAvatarSize>("size", {
        lg: "lg",
        sm: "sm",
        xl: "xl",
        xs: "xs",
      }),
      ...statusProps,
    }),
  },
  variant: {variant: "image"},
})
