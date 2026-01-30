// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"
import {User} from "lucide-react"

import type {
  QdsAvatarSize,
  QdsAvatarVariant,
} from "@qualcomm-ui/qds-core/avatar"
import {Avatar} from "@qualcomm-ui/react/avatar"

const sharedProps = {
  size: figma.enum<QdsAvatarSize>("size", {
    lg: "lg",
    sm: "sm",
    xl: "xl",
    xs: "xs",
  }),
  status: figma.boolean("status", {
    true: "active",
  }),
  statusIndicator: figma.boolean("status", {
    true: <Avatar.Status />,
  }),
  variant: figma.enum<QdsAvatarVariant>("emphasis", {
    brand: "brand",
    "high-contrast": "contrast",
    neutral: "neutral",
  }),
}

// Icon variant
figma.connect(Avatar, "<FIGMA_COMPONENTS_BASE>?node-id=6997-21264", {
  example: ({size, status, statusIndicator, variant}) => (
    <Avatar.Root size={size} status={status} variant={variant}>
      <Avatar.Content icon={User} />
      {statusIndicator}
    </Avatar.Root>
  ),
  props: sharedProps,
  variant: {variant: "icon"},
})

// Initial variant
figma.connect(Avatar, "<FIGMA_COMPONENTS_BASE>?node-id=6997-21264", {
  example: ({initialText, size, status, statusIndicator, variant}) => (
    <Avatar.Root size={size} status={status} variant={variant}>
      <Avatar.Content>{initialText}</Avatar.Content>
      {statusIndicator}
    </Avatar.Root>
  ),
  props: {
    ...sharedProps,
    initialText: figma.string("initialText"),
  },
  variant: {variant: "initial"},
})

// Image variant
figma.connect(Avatar, "<FIGMA_COMPONENTS_BASE>?node-id=6997-21264", {
  example: ({size, status, statusIndicator}) => (
    <Avatar.Root size={size} status={status}>
      <Avatar.Image alt="User avatar" src="path/to/image.jpg" />
      {statusIndicator}
    </Avatar.Root>
  ),
  props: sharedProps,
  variant: {variant: "image"},
})
